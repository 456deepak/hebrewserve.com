// Simple in-memory cache for API responses
const cache = new Map();

// Default cache expiration time (5 minutes)
const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {any|null} - Cached data or null if not found/expired
 */
export const getFromCache = (key) => {
  if (!cache.has(key)) return null;
  
  const { data, expiry } = cache.get(key);
  if (Date.now() > expiry) {
    cache.delete(key);
    return null;
  }
  
  return data;
};

/**
 * Save data to cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} [expiryTime] - Cache expiration time in milliseconds
 */
export const saveToCache = (key, data, expiryTime = DEFAULT_CACHE_TIME) => {
  cache.set(key, {
    data,
    expiry: Date.now() + expiryTime
  });
};

/**
 * Clear all cached data
 */
export const clearCache = () => {
  cache.clear();
};

/**
 * Clear specific cached data
 * @param {string} key - Cache key to clear
 */
export const clearCacheItem = (key) => {
  cache.delete(key);
};
