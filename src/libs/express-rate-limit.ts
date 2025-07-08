/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 60, // Limit each IP to 60 requests per windowMs
  standardHeaders: 'draft-8', // Standard headers for rate limit info
  legacyHeaders: false, // Disable deprecated X-RateLimit-* headers
  message: {
    error:
      'You have sent too many request in a short period of time. Please try again later.',
  },
});

export default limiter;
