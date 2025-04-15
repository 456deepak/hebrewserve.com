import axios from 'utils/axios';
import { getFromCache, saveToCache } from './apiCache';

/**
 * Make an API request with retry and caching
 * @param {string} url - API endpoint
 * @param {Object} options - Request options
 * @param {string} cacheKey - Key for caching
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} retryDelay - Delay between retries in ms
 * @returns {Promise<any>} - API response
 */
export const fetchWithRetry = async (
  url,
  options = {},
  cacheKey = null,
  maxRetries = 2,
  retryDelay = 1000
) => {
  // Try to get from cache first if cacheKey is provided
  if (cacheKey) {
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  let lastError;
  let retries = 0;

  while (retries <= maxRetries) {
    try {
      // Make the API request
      const response = await axios.get(url, options);
      const data = response.data.result || response.data.data;
      
      // Cache the response if cacheKey is provided
      if (cacheKey && data) {
        saveToCache(cacheKey, data);
      }
      
      return data;
    } catch (error) {
      lastError = error;
      
      // Don't retry for certain error codes
      if (error.response) {
        // Don't retry for 401 (Unauthorized) or 404 (Not Found)
        if ([401, 404].includes(error.response.status)) {
          throw error;
        }
        
        // For 429 (Too Many Requests), wait longer
        if (error.response.status === 429) {
          retryDelay = 5000; // Wait 5 seconds before retrying
        }
      }
      
      // Increase retry count
      retries++;
      
      // If we've reached max retries, throw the error
      if (retries > maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  throw lastError;
};

/**
 * Make a POST request with retry
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @param {Object} options - Request options
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} retryDelay - Delay between retries in ms
 * @returns {Promise<any>} - API response
 */
export const postWithRetry = async (
  url,
  data = {},
  options = {},
  maxRetries = 2,
  retryDelay = 1000
) => {
  let lastError;
  let retries = 0;

  while (retries <= maxRetries) {
    try {
      // Make the API request
      const response = await axios.post(url, data, options);
      return response.data;
    } catch (error) {
      lastError = error;
      
      // Don't retry for certain error codes
      if (error.response) {
        // Don't retry for 401 (Unauthorized) or 404 (Not Found)
        if ([401, 404].includes(error.response.status)) {
          throw error;
        }
        
        // For 429 (Too Many Requests), wait longer
        if (error.response.status === 429) {
          retryDelay = 5000; // Wait 5 seconds before retrying
        }
      }
      
      // Increase retry count
      retries++;
      
      // If we've reached max retries, throw the error
      if (retries > maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  throw lastError;
};
