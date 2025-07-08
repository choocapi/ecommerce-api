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
import { generateAccessToken, generateRefreshToken } from '@/libs/jwt';
import { logger } from '@/libs/winston';
import config from '@/config';

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

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as UserData;

    const user = await User.findOne({ email })
      .select('username email password role')
      .lean()
      .exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found.',
      });
      return;
    }

    // Generate access token and refresh token for user
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    await Token.create({
      token: refreshToken,
      userId: user._id,
    });
    logger.info('Refresh token created for user', {
      userId: user._id,
      token: refreshToken,
    });

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'User logged in successfully.',
      data: {
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
    });

    logger.info('User logged in successfully', user);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: error,
    });

    logger.error('Error during user login', error);
  }
};

export default login;
