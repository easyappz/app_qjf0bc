import { instance } from './axios';
import { getAuthToken } from './auth';

/**
 * Get authorization headers with token
 * @returns {Object} Headers object with Authorization
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    Authorization: `Token ${token}`,
  };
};

/**
 * Get current user profile (isSecure: true)
 * @returns {Promise} Response with user profile data
 */
export const getProfile = async () => {
  const response = await instance.get('/api/profile/', {
    headers: getAuthHeaders(),
  });
  
  return response.data;
};

/**
 * Update user profile (PUT)
 * @param {string} username - New username
 * @returns {Promise} Response with updated profile data
 */
export const updateProfile = async (username) => {
  const response = await instance.put('/api/profile/update/', {
    username,
  }, {
    headers: getAuthHeaders(),
  });
  
  return response.data;
};
