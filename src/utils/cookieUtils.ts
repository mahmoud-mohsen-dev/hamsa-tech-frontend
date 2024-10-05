/**
 * Set a cart ID in cookies.
 * @param cartId - The cart ID to store.
 * @param days - The number of days until the cookie expires.
 * @returns The cart ID if it was successfully set, otherwise null.
 */
export const setCartId = (cartId: string): string | null => {
  const days = 30;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `cartId=${cartId}; expires=${expires}; path=/`;
  return getCartId();
};

/**
 * Get the cart ID from cookies.
 * @returns The cart ID if it exists, otherwise null.
 */
export const getCartId = (): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; cartId=`);

  if (parts.length === 2)
    return parts.pop()?.split(';').shift() || null;
  return null; // Return null if cookie doesn't exist
};

/**
 * Remove the cart ID from cookies.
 */
export const removeCartId = (): void => {
  document.cookie = `cartId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};

/**
 * Check if the cart ID exists in cookies.
 * @returns True if the cart ID exists, otherwise false.
 */
export const doesCartIdExist = (): boolean => {
  return document.cookie
    .split('; ')
    .some((row) => row.startsWith('cartId='));
};

// ===============================================================================
// guest user
/**
 * Set a guest user ID in cookies.
 * @param guestUserId - The guest user ID to store.
 * @param days - The number of days until the cookie expires.
 * @returns The guest user ID if it was successfully set, otherwise null.
 */
export const setCookie = (
  cookieName: string,
  cookieValue: string,
  days: number = 30
): string | null => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${cookieName}=${cookieValue}; expires=${expires}; path=/`;
  return getCookie(cookieName);
};

/**
 * Get the guest user ID from cookies.
 * @returns The guest user ID if it exists, otherwise null.
 */
export const getCookie = (cookieName: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${cookieName}=`);

  if (parts.length === 2)
    return parts.pop()?.split(';').shift() || null;
  return null; // Return null if cookie doesn't exist
};

/**
 * Remove the guest user ID from cookies.
 */
export const removeCookie = (cookieName: string): void => {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};

/**
 * Check if the guest user ID exists in cookies.
 * @returns True if the guest user ID exists, otherwise false.
 */
export const doesCookieByNameExist = (
  cookieName: string
): boolean => {
  return document.cookie
    .split('; ')
    .some((row) => row.startsWith(`${cookieName}=`));
};
