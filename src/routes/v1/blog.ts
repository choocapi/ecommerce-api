/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */
import { Router } from 'express';
import { checkSchema } from 'express-validator';
import multer from 'multer';

/**
 * Middlewares
 */
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validation-error';
import authorize from '@/middlewares/authorize';
import uploadBlogBanner from '@/middlewares/upload-blog-banner';
import {
  createBlogSchema,
  paginationSchema,
  userIdSchema,
  blogSlugSchema,
  blogIdSchema,
  updateBlogSchema,
} from '@/middlewares/validation-schemas';
import getAllBlogs from '@/controllers/v1/blog/get-all-blogs';
import getBlogsByUser from '@/controllers/v1/blog/get-blogs-by-user';
import getBlogBySlug from '@/controllers/v1/blog/get-blog-by-slug';
import updateBlog from '@/controllers/v1/blog/update-blog';
import deleteBlog from '@/controllers/v1/blog/delete-blog';

/**
 * Controllers
 */
import createBlog from '@/controllers/v1/blog/create-blog';

const upload = multer();

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  checkSchema(createBlogSchema),
  validationError,
  uploadBlogBanner('post'),
  createBlog,
);

router.get(
  '/',
  authenticate,
  authorize(['admin', 'buyer', 'seller']),
  checkSchema(paginationSchema),
  validationError,
  getAllBlogs,
);

router.get(
  '/user/:userId',
  authenticate,
  authorize(['admin', 'buyer', 'seller']),
  checkSchema(userIdSchema),
  checkSchema(paginationSchema),
  validationError,
  getBlogsByUser,
);

router.get(
  '/:slug',
  authenticate,
  authorize(['admin', 'buyer', 'seller']),
  checkSchema(blogSlugSchema),
  validationError,
  getBlogBySlug,
);

router.put(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  checkSchema(blogIdSchema),
  upload.single('banner_image'),
  checkSchema(updateBlogSchema),
  validationError,
  uploadBlogBanner('put'),
  updateBlog,
);

router.delete(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  checkSchema(blogIdSchema),
  validationError,
  deleteBlog,
);

export default router;
