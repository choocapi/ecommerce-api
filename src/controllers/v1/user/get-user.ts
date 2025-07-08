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

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select('-__v').lean().exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Get a user successfully.',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: error,
    });

    logger.error('Error while getting a user.', error);
  }
};

export default getUser;
