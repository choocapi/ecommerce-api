/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */
import * as express from 'express';

/**
 * Types
 */
import type { Types } from 'mongoose';

/**
 * Extend the Express Request interface to include userId
 */
declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId;
    }
  }
}
