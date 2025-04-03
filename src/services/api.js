import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Axios instance
const api = axios.create({
  baseURL: 'https://api.ustatai.com', // Replace with your actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh the token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post('https://api.ustatai.com/auth/refresh', {
          refreshToken,
        });

        const { token } = response.data;
        
        // Save the new token
        await AsyncStorage.setItem('token', token);
        
        // Update the authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refreshing fails, redirect to login
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        // You would typically trigger a logout action here through Redux
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  logout: () => api.post('/auth/logout'),
};

// User Services
export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.put('/user/password', data),
};

// Blog Services
export const blogService = {
  getPosts: (params) => api.get('/blog/posts', { params }),
  getPost: (id) => api.get(`/blog/posts/${id}`),
};

// Subscription Services
export const subscriptionService = {
  getPackages: () => api.get('/subscription/packages'),
  getUserSubscription: () => api.get('/subscription/user'),
  subscribe: (packageId, paymentData) => api.post('/subscription/subscribe', { packageId, ...paymentData }),
  cancelSubscription: () => api.post('/subscription/cancel'),
};

// Payment Services
export const paymentService = {
  getPaymentMethods: () => api.get('/payment/methods'),
  addPaymentMethod: (data) => api.post('/payment/methods', data),
  deletePaymentMethod: (id) => api.delete(`/payment/methods/${id}`),
  getBillingHistory: () => api.get('/payment/history'),
};

export default api;