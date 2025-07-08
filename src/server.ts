/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
 * Local modules
 */
import config from '@/config';
import limiter from '@/libs/express-rate-limit';
import { connectToDatabase, disconnectFromDatabase } from '@/libs/mongoose';
import { logger } from '@/libs/winston';

/**
 * Types
 */
import type { CorsOptions } from 'cors';

/**
 * Routes
 */
import v1Routes from '@/routes/v1';

/**
 * Express app initial
 */
const app = express();

// Config CORS options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGIN.includes(origin)
    ) {
      callback(null, true);
    } else {
      // Reject requests from non-whitelisted origins
      callback(
        new Error(`CORS error: ${origin} is not allowed by CORS.`),
        false,
      );
      logger.warn(`CORS error: ${origin} is not allowed by CORS.`);
    }
  },
};

// Apply cors middleware
app.use(cors(corsOptions));

// Enable JSON body parser
app.use(express.json());

// Enable URL-encoded body parser with extended mode
// 'extended' option allows to parse nested objects via qs library
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Enable response compression to reduce payload size
app.use(
  compression({
    threshold: 1024, // Only compress responses larger than 1KB
  }),
);

// Use helmet to enhance security by setting various HTTP headers
app.use(helmet());

// Apply rate limit middleware to prevent excessive requests
app.use(limiter);

/**
 * Immediately-invoked async function expression (IIFE) to start the server
 * - Tries to connect to the database
 * - Defines the API routes ('/api/v1')
 * - Starts the server on the specified port and logs the running URL
 * - If an error occurs, logs and exit the process with status code 1
 */
(async () => {
  try {
    await connectToDatabase();

    app.use('/api/v1', v1Routes);

    app.listen(config.PORT, () => {
      logger.info(`Server running: http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

/**
 * Handle server shutdown
 * - Disconnect from the database
 * - Log a result message
 * - Exit the process with status code 0
 */
const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.warn('Server SHUTDOWN');
    process.exit(0);
  } catch (error) {
    logger.error('Error during server shutdown:', error);
  }
};

/**
 * Listens for termination signals (SIGINT, SIGTERM)
 * - 'SIGINT' is sent when the user interrupts the process (Ctrl+C)
 * - 'SIGTERM' is sent when the process is terminated (e.g., 'kill', container stop)
 * - When a signal is received, it calls the handleServerShutdown function
 */
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
