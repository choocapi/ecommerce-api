/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Local modules
 */
import { logger } from '@/libs/winston';

/**
 * Models
 */
import User from '@/models/user';

/**
 * Types
 */
import type { Request, Response, NextFunction } from 'express';

export type AuthRole = 'admin' | 'buyer' | 'seller';

const authorize = (roles: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select('role').exec();

      if (!user) {
        res.status(404).json({
          code: 'NotFound',
          message: 'User not found.',
        });
        return;
      }

      if (!roles.includes(user.role)) {
        res.status(403).json({
          code: 'AuthorizationError',
          message:
            'Access denied, you are not authorized to access this resource.',
        });
        return;
      }

      return next();
    } catch (error) {
      res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error.',
        error: error,
      });

      logger.error('Error while authorizing user', error);
    }
  };
};

export default authorize;
