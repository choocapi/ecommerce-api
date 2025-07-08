/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Local modules
 */
import config from '@/config';
import { logger } from '@/libs/winston';

/**
 * Types
 */
import type { ConnectOptions } from 'mongoose';

/**
 * Client options
 */
const clientOptions: ConnectOptions = {
  dbName: 'ecommerce-db',
  appName: 'Ecommerce API',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

/**
 * Connect to the MongoDB using mongoose
 * - Check MONGO_URI exists
 * - Connect to the database
 * - If an error occurs, throw an error
 * - Log the result message
 */
export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the environment variables.');
  }

  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    logger.info('Connected to database successfully.');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    logger.error('Error connecting to database.', error);
  }
};

/**
 * Disconnect from the MongoDB using mongoose
 * - Disconnect from the database
 * - If an error occurs, throw an error
 * - Log the result message
 */
export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from database successfully.');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    logger.error('Error disconnecting from database.', error);
  }
};
