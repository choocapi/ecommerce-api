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
import Blog from '@/models/blog';
import User from '@/models/user';

interface QueryType {
  status?: 'draft' | 'published';
}

const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;

    const user = await User.findById(userId).select('role').lean().exec();
    const query: QueryType = {};

    // Show only the published post to a normal user
    if (user?.role === 'buyer' || user?.role === 'seller') {
      query.status = 'published';
    }

    const total = await Blog.countDocuments(query).exec();
    const blogs = await Blog.find(query)
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 }) // desc -1, asc 1
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      message: 'Get all blogs successfully.',
      data: {
        limit,
        offset,
        total,
        blogs,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: error,
    });

    logger.error('Error while fetching blogs.', error);
  }
};

export default getAllBlogs;
