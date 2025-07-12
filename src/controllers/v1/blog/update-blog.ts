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
import type { IBlog } from '@/models/blog';

/**
 * Models
 */
import Blog from '@/models/blog';
import User from '@/models/user';

/**
 * Purify the blog content
 */
const window = new JSDOM().window;
const purify = DOMPurify(window);

type BlogData = Partial<Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>>;

const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, banner, status } = req.body as BlogData;

    const userId = req.userId;
    const blogId = req.params.blogId;

    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(blogId).select('-__v').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found.',
      });
      return;
    }

    if (blog.author !== userId && user?.role !== 'admin') {
      res.status(403).json({
        code: 'AuthorizationError',
        message:
          'Access denied, you are not authorized to access this resource.',
      });

      logger.warn('A user tried to update a blog without permission', {
        userId,
        blog,
      });
      return;
    }

    if (title) blog.title = title;
    if (content) {
      const cleanContent = purify.sanitize(content);
      blog.content = cleanContent;
    }
    if (banner) blog.banner = banner;
    if (status) blog.status = status;

    await blog.save();
    logger.info('Blog updated', { blog });

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully.',
      data: {
        blog,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error while updating blog', error);
  }
};

export default updateBlog;
