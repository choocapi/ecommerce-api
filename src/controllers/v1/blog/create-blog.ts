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

/**
 * Purify the blog content
 */
const window = new JSDOM().window;
const purify = DOMPurify(window);

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, banner, status } = req.body as BlogData;
    const userId = req.userId;

    const cleanContent = purify.sanitize(content);

    const newBlog = await Blog.create({
      title,
      content: cleanContent,
      banner,
      status,
      author: userId,
    });
    logger.info('New blog created', newBlog);

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: {
        blog: newBlog,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during blog creation', error);
  }
};

export default createBlog;
