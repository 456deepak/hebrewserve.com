import axios from 'axios';

let baseURL = import.meta.env.VITE_APP_TEST === '1' ? import.meta.env.VITE_APP_TEST_API_URL : import.meta.env.VITE_APP_PROD_API_URL
baseURL = baseURL + import.meta.env.VITE_APP_MAIN_PATH
const axiosServices = axios.create({ baseURL });

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
    // Handle 401 Unauthorized - redirect to login
    if (error.response && error.response.status === 401 && !window.location.href.includes('/login')) {
      window.location.pathname = '/login';
    }

    // Handle 429 Too Many Requests
    if (error.response && error.response.status === 429) {
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
    }

    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
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
