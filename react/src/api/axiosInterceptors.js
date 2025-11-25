import { instance } from './axios';
import { getAuthToken } from './auth';

/**
 * Setup request interceptor to automatically add token to headers for secured requests
 */
instance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    
    // Add token to Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
