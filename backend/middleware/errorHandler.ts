import { Request, Response, NextFunction } from 'express';
import { createLogger } from 'winston';

const logger = createLogger();

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method
  });

  if (error.message.includes('API key')) {
    return res.status(401).json({
      error: 'Authentication error'
    });
  }

  if (error.message.includes('rate limit')) {
    return res.status(429).json({
      error: 'Too many requests'
    });
  }

  res.status(500).json({
    error: 'Internal server error'
  });
};