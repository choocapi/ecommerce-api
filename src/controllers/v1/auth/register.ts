import { model } from 'mongoose';
/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */

/**
 * Local modules
 */
import { logger } from '@/libs/winston';
import config from '@/config';
import { genUsername } from '@/utils';
import { generateAccessToken, generateRefreshToken } from '@/libs/jwt';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

/**
 * Models
 */
import User from '@/models/user';
import Token from '@/models/token';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;

  // Check if user is whitelisted admin
  if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    res.status(403).json({
      code: 'AuthorizationError',
      message: 'You cannot register as an admin.',
    });

    logger.warn(
      `User with email ${email} tried to register as an admin but not in the whitelist`,
    );
    return;
  }

  // Create new user
  try {
    const username = genUsername();

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    // Generate access token and refresh token for new user
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store refresh token in db
    await Token.create({
      token: refreshToken,
      userId: newUser._id,
    });
    logger.info('Refresh token created for user', {
      userId: newUser._id,
      token: refreshToken,
    });

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: {
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
        accessToken,
      },
    });

    logger.info('User registered successfully.', {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: error,
    });

    logger.error('Error during user registration.', error);
  }
};

export default register;
