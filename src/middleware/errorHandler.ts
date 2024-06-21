import { Request, Response, NextFunction } from "express";
import { validationResult } from 'express-validator';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const errorMessage = err instanceof Error ? err.message : "Unknown error";
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({ error: errorMessage });
};