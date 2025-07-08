/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Local modules
 */
import { logger } from '@/libs/winston';
import config from '@/config';

/**
 * Types
 */
import type { Request, Response } from 'express';

/**
 * Models
 */
import User from '@/models/user';

const getAllUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;
    const total = await User.countDocuments().exec();

    const users = await User.find()
      .select('-__v')
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      message: 'Get all users successfully.',
      data: {
        limit,
        offset,
        total,
        users,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: error,
    });

    logger.error('Error while getting all users.', error);
  }
};

export default getAllUser;
