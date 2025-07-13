/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Node modules
 */
import User from '@/models/user';
import { compare } from 'bcrypt';

/**
 * Schema for user registration
 * - email: string (custom: check if email already in use)
 * - password: string
 * - role: string (admin, buyer, seller)
 */
export const registerSchema = {
  email: {
    trim: true,
    notEmpty: {
      errorMessage: 'Email is required.',
    },
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: 'Email must be less than 50 characters.',
    },
    isEmail: {
      errorMessage: 'Invalid email address.',
    },
    custom: {
      options: async (value: string) => {
        const userExists = await User.exists({ email: value });
        if (userExists) {
          throw new Error('User email or password is invalid.');
        }
        return true;
      },
    },
  },
  password: {
    errorMessage:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
    trim: true,
    notEmpty: {
      errorMessage: 'Password is required.',
    },
    isLength: {
      options: {
        min: 8,
      },
    },
    matches: {
      options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    },
  },
  role: {
    optional: true,
    isString: {
      errorMessage: 'Role must be a string.',
    },
    isIn: {
      options: [['admin', 'buyer', 'seller']],
      errorMessage: 'Role must be either admin, buyer, or seller.',
    },
  },
};

/**
 * Schema for user login
 * - email: string (custom: check if email exists)
 * - password: string (custom: check if password is correct)
 */
export const loginSchema = {
  email: {
    trim: true,
    notEmpty: {
      errorMessage: 'Email is required.',
    },
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: 'Email must be less than 50 characters.',
    },
    isEmail: {
      errorMessage: 'Invalid email address.',
    },
    custom: {
      options: async (value: string) => {
        const userExists = await User.exists({ email: value });
        if (!userExists) {
          throw new Error('User email or password is invalid.');
        }
        return true;
      },
    },
  },
  password: {
    errorMessage:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
    trim: true,
    notEmpty: {
      errorMessage: 'Password is required.',
    },
    isLength: {
      options: {
        min: 8,
      },
    },
    matches: {
      options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    },
    custom: {
      options: async (value: string, { req }: { req: any }) => {
        const { email } = req.body as { email: string };
        const user = await User.findOne({ email })
          .select('password')
          .lean()
          .exec();

        if (!user) {
          throw new Error('User email or password is invalid.');
        }

        const isPasswordMatch = await compare(value, user.password);
        if (!isPasswordMatch) {
          throw new Error('User email or password is invalid.');
        }
      },
    },
  },
};

/**
 * Schema for updating user
 * - username: string (custom: check if username already in use)
 * - email: string (custom: check if email already in use)
 * - password: string
 * - first_name: string
 * - last_name: string
 */
export const updateUserSchema = {
  username: {
    optional: true,
    trim: true,
    isLength: {
      options: {
        max: 20,
      },
      errorMessage: 'Username must be less than 20 characters.',
    },
    custom: {
      options: async (value: string) => {
        const userExists = await User.exists({ username: value });

        if (userExists) {
          throw new Error('This username is already in use.');
        }
      },
    },
  },
  email: {
    optional: true,
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: 'Email must be less than 50 characters.',
    },
    isEmail: {
      errorMessage: 'Invalid email address.',
    },
    custom: {
      options: async (value: string) => {
        const userExists = await User.exists({ email: value });

        if (userExists) {
          throw new Error('This email is already in use.');
        }
      },
    },
  },
  password: {
    optional: true,
    errorMessage:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
    isLength: {
      options: {
        min: 8,
      },
    },
    matches: {
      options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    },
  },
  first_name: {
    optional: true,
    isLength: {
      options: {
        max: 20,
      },
      errorMessage: 'First name must be less than 20 characters.',
    },
  },
  last_name: {
    optional: true,
    isLength: {
      options: {
        max: 20,
      },
      errorMessage: 'Last name must be less than 20 characters.',
    },
  },
};

/**
 * Schema for token in cookies
 * - refreshToken: string
 */
export const tokenSchema = {
  refreshToken: {
    notEmpty: {
      errorMessage: 'Refresh token is required.',
    },
    isJWT: {
      errorMessage: 'Invalid refresh token.',
    },
  },
};

/**
 * Schema for ID
 * - id: string
 */
export const idSchema = (field: string) => {
  return {
    [field]: {
      notEmpty: {
        errorMessage: `${field} is required.`,
      },
      isMongoId: {
        errorMessage: `Invalid ${field}.`,
      },
    },
  };
};

/**
 * Schema for pagination
 * - limit: integer
 * - offset: integer
 */
export const paginationSchema = {
  limit: {
    optional: true,
    isInt: {
      options: {
        min: 1,
        max: 50,
      },
      errorMessage: 'Limit must be between 1 and 50.',
    },
  },
  offset: {
    optional: true,
    isInt: {
      options: {
        min: 0,
      },
      errorMessage: 'Offset must be positive integer.',
    },
  },
};

/**
 * Schema for blog creation
 * - title: string
 * - content: string
 * - status: string (draft, published)
 */
export const createBlogSchema = {
  title: {
    trim: true,
    notEmpty: {
      errorMessage: 'Title is required.',
    },
    isLength: {
      options: {
        max: 180,
      },
      errorMessage: 'Title must be less than 180 characters.',
    },
  },
  content: {
    trim: true,
    notEmpty: {
      errorMessage: 'Content is required.',
    },
  },
  status: {
    optional: true,
    isIn: {
      options: [['draft', 'published']],
    },
    errorMessage: 'Status must be either draft or published.',
  },
};

/**
 * Schema for blog slug
 * - slug: string
 */
export const blogSlugSchema = {
  slug: {
    notEmpty: {
      errorMessage: 'Slug is required.',
    },
  },
};

/**
 * Schema for updating blog
 * - title: string
 * - content: string
 * - status: string (draft, published)
 */
export const updateBlogSchema = {
  title: {
    optional: true,
    isLength: {
      options: {
        max: 180,
      },
      errorMessage: 'Title must be less than 180 characters.',
    },
  },
  content: {},
  status: {
    optional: true,
    isIn: {
      options: [['draft', 'published']],
    },
    errorMessage: 'Status must be either draft or published.',
  },
};

/**
 * Schema for comment creation
 * - content: string
 */
export const commentSchema = {
  content: {
    trim: true,
    notEmpty: {
      errorMessage: 'Content is required.',
    },
  },
};
