/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */
import winston from 'winston';

/**
 * Local modules
 */
import config from '@/config';

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

/**
 * Define the transports array to hold different logging transports
 * - Transports are the different ways to log messages (console, file, etc.)
 */
const transports: winston.transport[] = [];

// If the environment is not production, add a console transport
if (config.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // Add colors to log levels
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }), // Add timestamp to logs
        align(), // Align the log message
        printf(({ timestamp, level, message, ...meta }) => {
          const metaString = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : '';

          return `${timestamp} [${level}]: ${message} ${metaString}`;
        }),
      ),
    }),
  );
}

// Create a logger instance using Winston
const logger = winston.createLogger({
  level: config.LOG_LEVEL, // Set the logging level
  format: combine(timestamp(), errors({ stack: true }), json()), // Use json format for log messages
  transports,
  silent: config.NODE_ENV === 'test', // Disable logging in test environment
});

export { logger };
