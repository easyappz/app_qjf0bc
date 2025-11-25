import { instance } from './axios';

const TOKEN_KEY = 'authToken';

/**
 * Register a new user
 * @param {string} username - Username (3-150 characters)
 * @param {string} password - Password (min 8 characters)
 * @returns {Promise} Response with user data and token
 */
export const registerUser = async (username, password) => {
  const response = await instance.post('/api/register/', {
    username,
    password,
  });
  
  // Save token to localStorage after successful registration
  if (response.data.token) {
    localStorage.setItem(TOKEN_KEY, response.data.token);
  }
  
  return response.data;
};

/**
 * Login user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise} Response with token and user data
 */
export const loginUser = async (username, password) => {
  const response = await instance.post('/api/login/', {
    username,
    password,
  });
  
  // Save token to localStorage after successful login
  if (response.data.token) {
    localStorage.setItem(TOKEN_KEY, response.data.token);
  }
  
  return response.data;
};

/**
 * Logout user - clear token from localStorage
 */
export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Get stored auth token
 * @returns {string|null} Auth token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};
