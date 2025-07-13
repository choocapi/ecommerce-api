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

interface ILike {
  blogId?: Types.ObjectId;
  userId: Types.ObjectId;
  commentId?: Types.ObjectId;
}

const likeSchema = new Schema<ILike>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
    },
    commentId: {
      type: Schema.Types.ObjectId,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export default model<ILike>('Like', likeSchema);
