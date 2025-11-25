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
 * Update user profile - full update (PUT)
 * @param {Object} data - Profile data to update
 * @param {string} [data.email] - User email
 * @param {string} [data.first_name] - First name (max 150 characters)
 * @param {string} [data.last_name] - Last name (max 150 characters)
 * @returns {Promise} Response with updated profile data
 */
export const updateProfile = async (data) => {
  const response = await instance.put('/api/profile/update/', data, {
    headers: getAuthHeaders(),
  });
  
  return response.data;
};

/**
 * Update user profile - partial update (PATCH)
 * @param {Object} data - Profile data to update (partial)
 * @param {string} [data.email] - User email
 * @param {string} [data.first_name] - First name (max 150 characters)
 * @param {string} [data.last_name] - Last name (max 150 characters)
 * @returns {Promise} Response with updated profile data
 */
export const updateProfilePartial = async (data) => {
  const response = await instance.patch('/api/profile/update/', data, {
    headers: getAuthHeaders(),
  });
  
  return response.data;
};
