import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Axios instance with the correct development API URL
const api = axios.create({
  baseURL: 'https://dev.api.ustat.ai', // Use the development API URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add detailed logging for debugging
api.interceptors.request.use(
  async (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data,
    });
    
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.log('Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.log('Request error interceptor:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with logging
api.interceptors.response.use(
  (response) => {
    console.log('API Response success:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    console.log('API Response error:', {
      url: error.config?.url,
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    });
    
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh the token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        
        // Save the new token
        await AsyncStorage.setItem('accessToken', accessToken);
        
        // Update the authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refreshing fails, redirect to login
        await AsyncStorage.removeItem('accessToken');
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