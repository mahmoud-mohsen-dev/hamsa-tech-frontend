// lib/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:1337', // Set your base URL here
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
// Optionally add interceptors to handle requests/responses globally
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the request before it gets sent (e.g., attach tokens)
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful response
    return response;
  },
  (error) => {
    // Handle response error globally (e.g., 401, 403 errors)
    if (error.response.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
