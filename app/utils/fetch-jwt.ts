// utils/fetchJwt.js

import axios from 'axios';

export const fetchJwtToken = async () => {
  try {
    const response = await axios.get('/api/get-jwt');
    return response.data.token;
  } catch (error) {
    console.error('Error fetching JWT token:', error.response?.data || error.message);
    throw error;
  }
};
