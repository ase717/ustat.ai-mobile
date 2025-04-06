import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen.js';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const [initialRoute, setInitialRoute] = useState('Register');

  useEffect(() => {
    // Check if we have a target screen from onboarding
    const checkTargetScreen = async () => {
      try {
        const targetScreen = await AsyncStorage.getItem('authTargetScreen');
        if (targetScreen) {
          setInitialRoute(targetScreen);
          // Clear the stored target screen
          await AsyncStorage.removeItem('authTargetScreen');
        }
      } catch (e) {
        console.warn('Failed to get target screen', e);
      }
    };

    checkTargetScreen();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator; 