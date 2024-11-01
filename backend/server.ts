import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { OpenAI } from 'openai';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { createLogger, format, transports } from 'winston';
import { encrypt, decrypt } from './utils/encryption';
import { validateApiKey } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

// Configure Winston logger
const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple()
  }));
}

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);
app.use(express.json());

// API key rotation system
class ApiKeyManager {
  private static instance: ApiKeyManager;
  private keys: Map<string, string[]>;
  private currentIndices: Map<string, number>;

  private constructor() {
    this.keys = new Map();
    this.currentIndices = new Map();
    this.initializeKeys();
  }

  public static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }

  private initializeKeys() {
    // Initialize with encrypted keys
    const services = ['openai', 'brevo'];
    services.forEach(service => {
      const keys = process.env[`${service.toUpperCase()}_API_KEYS`]?.split(',') || [];
      this.keys.set(service, keys.map(key => encrypt(key)));
      this.currentIndices.set(service, 0);
    });
  }

  public getCurrentKey(service: string): string {
    const keys = this.keys.get(service);
    const index = this.currentIndices.get(service) || 0;
    if (!keys || keys.length === 0) {
      throw new Error(`No API keys available for ${service}`);
    }
    return decrypt(keys[index]);
  }

  public rotateKey(service: string): void {
    const keys = this.keys.get(service);
    if (!keys || keys.length <= 1) return;

    let currentIndex = this.currentIndices.get(service) || 0;
    currentIndex = (currentIndex + 1) % keys.length;
    this.currentIndices.set(service, currentIndex);
    logger.info(`Rotated API key for ${service}`);
  }
}

const apiKeyManager = ApiKeyManager.getInstance();

// Automatic key rotation
setInterval(() => {
  ['openai', 'brevo'].forEach(service => {
    apiKeyManager.rotateKey(service);
  });
}, 24 * 60 * 60 * 1000); // Rotate every 24 hours

// Initialize API clients
const openai = new OpenAI({
  apiKey: apiKeyManager.getCurrentKey('openai'),
});

const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = apiKeyManager.getCurrentKey('brevo');
const brevoApi = new SibApiV3Sdk.ContactsApi();

// Protected API routes
app.use('/api', validateApiKey);

// Chat endpoint with error handling
app.post('/api/chat', async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      throw new Error('Message is required');
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: 'gpt-3.5-turbo',
    });

    logger.info('Chat message processed successfully');
    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    logger.error('Chat API error:', error);
    next(error);
  }
});

// Waitlist endpoint with error handling
app.post('/api/waitlist', async (req, res, next) => {
  try {
    const { firstName, lastName, email, message } = req.body;
    if (!email) {
      throw new Error('Email is required');
    }

    const createContact = new SibApiV3Sdk.CreateContact();
    createContact.email = email;
    createContact.attributes = { FIRSTNAME: firstName, LASTNAME: lastName, MESSAGE: message };
    
    await brevoApi.createContact(createContact);
    logger.info('Contact added to waitlist successfully');
    res.json({ success: true });
  } catch (error) {
    logger.error('Waitlist API error:', error);
    next(error);
  }
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});