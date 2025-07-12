/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */
import { v2 as cloudinary } from 'cloudinary';

/**
 * Local modules
 */
import config from '@/config';
import { logger } from '@/libs/winston';

/**
 * Types
 */
import type { UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: config.NODE_ENV === 'production',
});

const uploadToCloudinary = async (
  buffer: Buffer<ArrayBufferLike>,
  publicId?: string,
): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          resource_type: 'image',
          folder: 'ecommerce-api',
          public_id: publicId, // if publicId is provided, it will overwrite the existing image
          transformation: { quality: 'auto' },
        },
        (error, result) => {
          if (error) {
            logger.error('Error while uploading image to cloudinary', error);
            reject(error);
          }

          resolve(result);
        },
      )
      .end(buffer);
  });
};

export default uploadToCloudinary;
