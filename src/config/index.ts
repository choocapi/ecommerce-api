/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */
import dotenv from 'dotenv';

/**
 * Types
 */
import type ms from 'ms';

dotenv.config();

const config = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',
  WHITELIST_ORIGIN: process.env.WHITELIST_ORIGIN || '*',
  MONGO_URI: process.env.MONGO_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN as ms.StringValue,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as ms.StringValue,
  WHITELIST_ADMINS_MAIL: process.env.WHITELIST_ADMINS_MAIL || '',
  defaultResLimit: 20,
  defaultResOffset: 0,
};

export default config;
