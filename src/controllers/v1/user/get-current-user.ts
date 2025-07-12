/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Local modules
 */
import { logger } from '@/libs/winston';

/**
 * Types
 */
import type { Request, Response } from 'express';

/**
 * Models
 */
import User from '@/models/user';

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select('-__v').lean().exec();

    res.status(200).json({
      success: true,
      message: 'Get current user successfully.',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: error,
    });

    logger.error('Error while getting current user', error);
  }
};

export default getCurrentUser;
