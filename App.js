import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { ApiProvider } from './src/contexts/ApiContext';
import store, { persistor } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import theme from './src/theme/theme';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './src/navigation/AuthNavigator';

const Stack = createStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialScreen, setInitialScreen] = useState('Splash');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // For testing - reset onboarding status
        await AsyncStorage.removeItem('hasSeenOnboarding');
        
        // Check if user has seen onboarding
        const hasSeenOnboardingValue = await AsyncStorage.getItem('hasSeenOnboarding');
        if (hasSeenOnboardingValue === 'true') {
          setHasSeenOnboarding(true);
        }
        
        // Pre-load fonts, images, or any other assets here
        await Font.loadAsync({
          'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
          'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
          'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // App is loaded
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Here we're using a separate component to render screens outside the Redux Provider
  if (!appIsReady) {
    return null;
  }

  // We can't use Redux for splash and onboarding screens, so we'll handle them separately
  if (initialScreen === 'Splash') {
    return (
      <SplashScreen 
        onFinish={() => {
          setInitialScreen(hasSeenOnboarding ? 'Main' : 'Onboarding');
        }} 
      />
    );
  }

  if (initialScreen === 'Onboarding') {
    return (
      <OnboardingScreen 
        onFinish={(targetScreen) => {
          // Save that user has seen onboarding
          AsyncStorage.setItem('hasSeenOnboarding', 'true');
          
          // Save target screen if provided
          if (targetScreen) {
            AsyncStorage.setItem('authTargetScreen', targetScreen);
          }
          
          setInitialScreen('Main');
        }} 
      />
    );
  }

  // Main app flow
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <ApiProvider>
            <StatusBar style="light" backgroundColor="#131313" />
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="AuthFlow" component={AuthNavigator} />
                <Stack.Screen name="Main" component={AppNavigator} />
              </Stack.Navigator>
            </NavigationContainer>
          </ApiProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}