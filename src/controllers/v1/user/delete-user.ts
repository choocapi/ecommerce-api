/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */
import { v2 as cloudinary } from 'cloudinary';

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
import Blog from '@/models/blog';

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    const blogs = await Blog.find({ author: userId })
      .select('banner.publicId')
      .lean()
      .exec();
    const publicIds = blogs.map(({ banner }) => banner.publicId);

    await cloudinary.api.delete_resources(publicIds);
    logger.info('Multiple blog banners deleted from Cloudinary', {
      publicIds,
    });

    await Blog.deleteMany({ author: userId });
    logger.info('Multiple blogs deleted', {
      userId,
      blogs,
    });

    await User.deleteOne({ _id: userId }).exec();
    logger.info('A user account has been deleted successfully.', {
      userId,
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: error,
    });

    logger.error('Error while deleting a user.', error);
  }
};

export default deleteUser;
