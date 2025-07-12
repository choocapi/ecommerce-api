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

/**
 * Generate a random slug from a title (e.g. my-title-abc123)
 */
export const genSlug = (title: string): string => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  const randomChars = Math.random().toString(36).slice(2);
  const uniqueSlug = `${slug}-${randomChars}`;

  return uniqueSlug;
};
