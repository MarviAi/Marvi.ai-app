import { Request, Response, NextFunction } from 'express';
import { createLogger } from 'winston';

const logger = createLogger();

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    logger.warn('API request without key');
    return res.status(401).json({ error: 'API key is required' });
  }

  if (apiKey !== process.env.API_ACCESS_KEY) {
    logger.warn('Invalid API key attempt');
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
};