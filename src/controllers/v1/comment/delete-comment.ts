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

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.userId;
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId)
      .select('blogId userId')
      .lean()
      .exec();

    if (!comment) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Comment not found.',
      });
      return;
    }

    const blog = await Blog.findById(comment.blogId)
      .select('commentsCount')
      .exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found.',
      });
      return;
    }

    if (!comment.userId.equals(currentUserId)) {
      res.status(403).json({
        code: 'AuthorizationError',
        message:
          'Access denied. You are not authorized to delete this comment.',
      });

      logger.warn('A user tried to delete a comment without permission', {
        userId: currentUserId,
        commentUserId: comment.userId,
        commentId,
      });
      return;
    }

    await Comment.deleteOne({ _id: commentId });
    logger.info('Comment deleted successfully', {
      commentId,
    });

    blog.commentsCount--;
    await blog.save();
    logger.info('Blog comments count decremented', {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error while deleting comment', error);
  }
};

export default deleteComment;
