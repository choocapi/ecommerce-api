/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

/**
 * Local modules
 */
import { logger } from '@/libs/winston';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IComment } from '@/models/comment';

/**
 * Models
 */
import Blog from '@/models/blog';
import Comment from '@/models/comment';

type CommentData = Pick<IComment, 'content'>;

/**
 * Purify the comment content
 */
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const commentBlog = async (req: Request, res: Response): Promise<void> => {
  const { content } = req.body as CommentData;
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const blog = await Blog.findById(blogId).select('_id commentsCount').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found.',
      });
      return;
    }

    const cleanContent = purify.sanitize(content);

    const newComment = await Comment.create({
      blogId,
      content: cleanContent,
      userId,
    });
    logger.info('New comment created', newComment);

    blog.commentsCount++;
    await blog.save();

    logger.info('Blog comments count updated', {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    res.status(201).json({
      success: true,
      message: 'Blog commented successfully',
      data: {
        comment: newComment,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during commenting a blog', error);
  }
};

export default commentBlog;
