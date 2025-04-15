/**
 * Simple in-memory cache for API responses
 */

// Cache storage
const cache = new Map();

// Default cache expiration time (15 minutes)
const DEFAULT_CACHE_TIME = 15 * 60 * 1000;

/**
 * Save data to cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} expirationTime - Cache expiration time in milliseconds
 */
export const saveToCache = (key, data, expirationTime = DEFAULT_CACHE_TIME) => {
  if (!key) return;
  
  const item = {
    data,
    expiry: Date.now() + expirationTime
  };
  
  cache.set(key, item);
};

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {any|null} - Cached data or null if not found or expired
 */
export const getFromCache = (key) => {
  if (!key) return null;
  
  const item = cache.get(key);
  
  // Return null if item doesn't exist or is expired
  if (!item || Date.now() > item.expiry) {
    cache.delete(key); // Clean up expired items
    return null;
  }
  
  return item.data;
};

/**
 * Clear cache
 * @param {string} key - Specific cache key to clear (optional)
 */
export const clearCache = (key) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

/**
 * Generate a cache key for income reports
 * @param {string} apiPoint - API endpoint
 * @param {number} type - Income type
 * @param {number} page - Page number
 * @returns {string} - Cache key
 */
export const generateIncomeReportCacheKey = (apiPoint, type, page = 1) => {
  return `${apiPoint}_type${type}_page${page}`;
};
