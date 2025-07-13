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
import Comment from '@/models/comment';

const getCommentsByBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId).select('_id').lean().exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found.',
      });
      return;
    }

    const allComments = await Comment.find({ blogId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      message: 'Get comments by blog successfully.',
      data: {
        comments: allComments,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during getting comments by blog', error);
  }
};

export default getCommentsByBlog;
