/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */
import { Schema, model } from 'mongoose';

/**
 * Types
 */
import type { Types } from 'mongoose';

export interface IComment {
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<IComment>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required.'],
      maxLength: [1000, 'Content must be less than 1000 characters.'],
    },
  },
  { timestamps: true },
);

export default model<IComment>('Comment', commentSchema);
