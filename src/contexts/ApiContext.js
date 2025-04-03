import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create context
const ApiContext = createContext(null);

// Provider component
export const ApiProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  // Check for token on app start
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userDataString = await AsyncStorage.getItem('userData');
        
        if (token && userDataString) {
          const userData = JSON.parse(userDataString);
          dispatch(loginSuccess({ token, user: userData }));
        }
      } catch (error) {
        console.error('Failed to get auth token', error);
        dispatch(logout());
      }
    };

    if (!isAuthenticated) {
      checkToken();
    }
  }, [dispatch, isAuthenticated]);

  return (
    <ApiContext.Provider value={null}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook for using the API context
export const useApi = () => useContext(ApiContext);

export default ApiContext; 