/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 * Local modules
 */
import { verifyAccessToken } from '@/libs/jwt';
import { logger } from '@/libs/winston';

/**
 * Types
 */
import type { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose';

/**
 * Authenticate middleware
 * - Verify the user's access token from the Authorization header (Bearer token)
 * - If token is valid, attach the user's ID to the request object
 * - Otherwise, it return an appropriate error response
 */
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // If there's no Bearer token, return a 401 Unauthorized response
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      code: 'AuthenticationError',
      message: 'Access denied, no token provided.',
    });
    return;
  }

  // Split out the token from the 'Bearer' prefix
  const [_, token] = authHeader.split(' ');

  try {
    // Verify the token and extract the userId from the payload
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    // Attach the userId to the request object for later use
    req.userId = jwtPayload.userId;

    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token expired, request a new one with refresh token.',
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid access token, please login again.',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: error,
    });

    logger.error('Error during authentication', error);
  }
};

export default authenticate;
