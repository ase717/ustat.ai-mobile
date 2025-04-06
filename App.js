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
  const [appState, setAppState] = useState('splash'); // 'splash', 'onboarding', 'auth', 'main'
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Clear onboarding flag for testing (comment this out in production)
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

  const handleSplashFinish = () => {
    // If user has already seen onboarding, go to auth
    // Otherwise, go to onboarding
    if (hasSeenOnboarding) {
      setAppState('auth');
    } else {
      setAppState('onboarding');
    }
  };
  
  const handleOnboardingFinish = async (destination = 'auth', targetScreen = null) => {
    // Mark that user has seen onboarding
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    } catch (e) {
      console.warn('Failed to save onboarding status', e);
    }
    
    setAppState(destination);
    
    // Store the target screen for AuthNavigator to use
    if (targetScreen) {
      try {
        await AsyncStorage.setItem('authTargetScreen', targetScreen);
      } catch (e) {
        console.warn('Failed to save target screen', e);
      }
    }
  };

  if (!appIsReady) {
    return null;
  }

  // Render based on app state
  if (appState === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }
  
  if (appState === 'onboarding') {
    return <OnboardingScreen onFinish={handleOnboardingFinish} />;
  }

  // For both 'auth' and 'main' states, we use the navigation system
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <ApiProvider>
            <StatusBar style="light" backgroundColor="#131313" />
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="AuthFlow" component={AuthNavigator} />
                <Stack.Screen name="MainApp" component={AppNavigator} />
              </Stack.Navigator>
            </NavigationContainer>
          </ApiProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}