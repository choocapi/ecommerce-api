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
 * Controllers
 */
import register from '@/controllers/v1/auth/register';
import login from '@/controllers/v1/auth/login';
import refreshToken from '@/controllers/v1/auth/refresh-token';
import logout from '@/controllers/v1/auth/logout';

/**
 * Middlewares
 */
import validationError from '@/middlewares/validation-error';
import {
  registerSchema,
  loginSchema,
  tokenSchema,
} from '@/middlewares/validation-schemas';
import authenticate from '@/middlewares/authenticate';

/**
 * Models
 */

const router = Router();

router.post(
  '/register',
  checkSchema(registerSchema),
  validationError,
  register,
);

router.post('/login', checkSchema(loginSchema), validationError, login);

router.post(
  '/refresh-token',
  checkSchema(tokenSchema),
  validationError,
  refreshToken,
);

router.post('/logout', authenticate, logout);

export default router;
