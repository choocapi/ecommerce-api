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
import Blog from '@/models/blog';
import User from '@/models/user';

const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const slug = req.params.slug;

    const user = await User.findById(userId).select('role').lean().exec();

    const blog = await Blog.findOne({ slug })
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .lean()
      .exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found.',
      });
      return;
    }

    if (
      (user?.role === 'buyer' || user?.role === 'seller') &&
      blog.status === 'draft'
    ) {
      res.status(403).json({
        code: 'AuthorizationError',
        message:
          'Access denied, you are not authorized to access this resource.',
      });

      logger.warn('A user tried to access a draft blog', {
        userId,
        blog,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Get blog by slug successfully.',
      data: {
        blog,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: error,
    });

    logger.error('Error while fetching blog by slug.', error);
  }
};

export default getBlogBySlug;
