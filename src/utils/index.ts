/**
 * @copyright 2025 choocapi
 * @license MIT
 */

/**
 * Generate a random username (e.g. 'user-abc123')
 */

export const genUsername = (): string => {
  const usernamePrefix = 'user-';
  const randomString = Math.random().toString(36).slice(2);
  const username = usernamePrefix + randomString;

  return username;
};
