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
import validationError from '@/middlewares/validation-error';
import {
  updateUserSchema,
  paginationSchema,
  userIdSchema,
} from '@/middlewares/validation-schemas';

/**
 * Controllers
 */
import getCurrentUser from '@/controllers/v1/user/get-current-user';
import updateCurrentUser from '@/controllers/v1/user/update-current-user';
import deleteCurrentUser from '@/controllers/v1/user/delete-current-user';
import getAllUser from '@/controllers/v1/user/get-all-user';
import getUser from '@/controllers/v1/user/get-user';
import deleteUser from '@/controllers/v1/user/delete-user';

/**
 * Models
 */
import authorize from '@/middlewares/authorize';

const router = Router();

router.get(
  '/current',
  authenticate,
  authorize(['admin', 'buyer', 'seller']),
  getCurrentUser,
);

router.put(
  '/current',
  authenticate,
  authorize(['admin', 'buyer', 'seller']),
  checkSchema(updateUserSchema),
  validationError,
  updateCurrentUser,
);

router.delete(
  '/current',
  authenticate,
  authorize(['admin', 'buyer', 'seller']),
  deleteCurrentUser,
);

router.get(
  '/',
  authenticate,
  authorize(['admin']),
  checkSchema(paginationSchema),
  validationError,
  getAllUser,
);

router.get(
  '/:userId',
  authenticate,
  authorize(['admin']),
  checkSchema(userIdSchema),
  validationError,
  getUser,
);

router.delete(
  '/:userId',
  authenticate,
  authorize(['admin']),
  checkSchema(userIdSchema),
  validationError,
  deleteUser,
);

export default router;
