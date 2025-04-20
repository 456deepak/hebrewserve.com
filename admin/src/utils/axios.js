import axios from 'axios';

let baseURL = import.meta.env.VITE_APP_TEST === '1' ? import.meta.env.VITE_APP_TEST_API_URL : import.meta.env.VITE_APP_PROD_API_URL
baseURL = baseURL + import.meta.env.VITE_APP_MAIN_PATH

// Create axios instance with timeout and better configuration
const axiosServices = axios.create({
  baseURL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('serviceToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    // Create a variable to track if we've shown an error message
    let errorHandled = false;

    // Handle network errors (no response)
    if (!error.response) {
      console.error('Network Error:', error.message);
      import('sweetalert2').then((Swal) => {
        Swal.default.fire({
          icon: 'error',
          title: 'Connection Error',
          text: 'Please check your internet connection and try again.',
          timer: 3000,
          showConfirmButton: false
        });
      });
      errorHandled = true;
    }
    // Handle timeout errors
    else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.message);
      import('sweetalert2').then((Swal) => {
        Swal.default.fire({
          icon: 'warning',
          title: 'Request Timeout',
          text: 'The server is taking too long to respond. Please try again later.',
          timer: 3000,
          showConfirmButton: false
        });
      });
      errorHandled = true;
    }
    // Handle 401 Unauthorized - redirect to login
    else if (error.response.status === 401 && !window.location.href.includes('/login')) {
      console.warn('Unauthorized access, redirecting to login');
      // Add a small delay before redirecting to allow any cleanup
      setTimeout(() => {
        window.location.pathname = '/login';
      }, 100);
      errorHandled = true;
    }
    // Handle 429 Too Many Requests
    else if (error.response.status === 429) {
      console.warn('Rate limit exceeded. Please try again later.');
      // Show a user-friendly message
      import('sweetalert2').then((Swal) => {
        Swal.default.fire({
          icon: 'warning',
          title: 'Rate Limit Exceeded',
          text: 'Too many requests. Please wait a moment before trying again.',
          timer: 3000,
          showConfirmButton: false
        });
      });
      errorHandled = true;
    }
    // Handle 500 and other server errors
    else if (error.response.status >= 500) {
      console.error('Server Error:', error.response.status);
      import('sweetalert2').then((Swal) => {
        Swal.default.fire({
          icon: 'error',
          title: 'Server Error',
          text: 'Something went wrong on the server. Please try again later.',
          timer: 3000,
          showConfirmButton: false
        });
      });
      errorHandled = true;
    }

    // If we haven't handled the error specifically, use the response data or a default message
    if (!errorHandled) {
      console.error('API Error:', error.response?.status, error.response?.data);
    }

    return Promise.reject((error.response && error.response.data) || { message: error.message || 'Network Error' });
  }
);

export default axiosServices;

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.post(url, { ...config });

  return res.data;
};
