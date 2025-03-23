import Cookies from "js-cookie";

/**
 * Get value of cookie as JSON object
 * @param {string} key - The name of the cookie key
 * @return {object|null} - The value of the cookie as JSON object or null if key is not found
 */
export function getCookieValue(key) {
    const cookieValue = Cookies.get(key);
    if (cookieValue) {
      try {
        return JSON.parse(cookieValue);
      } catch (err) {
        console.error(`Failed to parse cookie value for key: ${key}`, err);
      }
    }
    return null;
}