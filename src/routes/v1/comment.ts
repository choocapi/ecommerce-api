/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */
import { Router } from 'express';
import { checkSchema } from 'express-validator';

/**
 * Middlewares
 */
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validation-error';
import { idSchema, commentSchema } from '@/middlewares/validation-schemas';

/**
 * Controllers
 */
import commentBlog from '@/controllers/v1/comment/comment-blog';
import getCommentsByBlog from '@/controllers/v1/comment/get-comments-by-blog';
import deleteComment from '@/controllers/v1/comment/delete-comment';

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'buyer', 'seller']),
  checkSchema(idSchema('blogId')),
  checkSchema(commentSchema),
  validationError,
  commentBlog,
);

router.get(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'buyer', 'seller']),
  checkSchema(idSchema('blogId')),
  validationError,
  getCommentsByBlog,
);

router.delete(
  '/:commentId',
  authenticate,
  authorize(['admin', 'buyer', 'seller']),
  checkSchema(idSchema('commentId')),
  validationError,
  deleteComment,
);

export default router;
