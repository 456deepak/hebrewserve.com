// Navigation utility functions

// Store the last navigation timestamp
let lastNavigationTime = 0;
const navigationCooldown = 300; // 300ms cooldown between navigations

/**
 * Debounce navigation to prevent rapid navigation issues
 * @param {Function} navigate - React Router's navigate function
 * @param {string} path - Path to navigate to
 * @param {Object} options - Navigation options
 * @returns {boolean} - Whether navigation was performed
 */
export const debouncedNavigate = (navigate, path, options = {}) => {
  const now = Date.now();
  
  // If we're within the cooldown period, don't navigate
  if (now - lastNavigationTime < navigationCooldown) {
    console.log('Navigation throttled:', path);
    return false;
  }
  
  // Update the last navigation time
  lastNavigationTime = now;
  
  // Perform the navigation
  navigate(path, options);
  return true;
};

/**
 * Create a navigation handler with debounce
 * @param {Function} navigate - React Router's navigate function
 * @returns {Function} - Debounced navigation handler
 */
export const createDebouncedNavigationHandler = (navigate) => {
  return (path, options = {}) => debouncedNavigate(navigate, path, options);
};
