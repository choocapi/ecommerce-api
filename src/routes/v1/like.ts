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
import { idSchema } from '@/middlewares/validation-schemas';

/**
 * Controllers
 */
import likeBlog from '@/controllers/v1/like/like-blog';
import unlikeBlog from '@/controllers/v1/like/unlike-blog';

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'buyer', 'seller']),
  checkSchema(idSchema('blogId')),
  checkSchema(idSchema('userId')),
  validationError,
  likeBlog,
);

router.delete(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'buyer', 'seller']),
  checkSchema(idSchema('blogId')),
  checkSchema(idSchema('userId')),
  validationError,
  unlikeBlog,
);

export default router;
