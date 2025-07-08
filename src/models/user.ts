/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */
import { Schema, model } from 'mongoose';
import { genSalt, hash } from 'bcrypt';

/**
 * Types
 */
export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'buyer' | 'seller';
  firstName?: string;
  lastName?: string;
}

/**
 * User schema
 */
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
      maxLength: [20, 'Username must be less than 20 characters.'],
      unique: [true, 'Username must be unique.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      maxLength: [50, 'Email must be less than 50 characters.'],
      unique: [true, 'Email must be unique.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      select: false, // Not return password in response
    },
    role: {
      type: String,
      required: [true, 'Role is required.'],
      enum: {
        values: ['admin', 'buyer', 'seller'],
        message: `{VALUE} is not a valid role.`,
      },
      default: 'buyer',
    },
    firstName: {
      type: String,
      maxLength: [20, 'First name must be less than 20 characters.'],
    },
    lastName: {
      type: String,
      maxLength: [20, 'Last name must be less than 20 characters.'],
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Hash the password
  this.password = await hash(this.password, 10);

  next();
});

export default model<IUser>('User', userSchema);
