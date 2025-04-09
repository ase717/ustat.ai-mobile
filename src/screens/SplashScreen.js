// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay
} from 'react-native-reanimated';

// Gradient circle component
const GradientCircle = ({ style, colors, size = 160 }) => (
  <View style={[styles.gradientCircleContainer, style]}>
    <LinearGradient
      colors={colors}
      style={[styles.gradientCircle, { width: size, height: size, borderRadius: size / 2 }]}
    />
  </View>
);

const SplashScreen = ({ onFinish }) => {
  // Logo animation
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  
  // Text animation
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    // Start logo animation
    logoOpacity.value = withTiming(1, { duration: 300 });
    logoScale.value = withSequence(
      withTiming(1.1, { duration: 400 }),
      withTiming(1, { duration: 200 })
    );
    
    // Start text animation after logo
    textOpacity.value = withDelay(
      300, 
      withTiming(1, { duration: 400 })
    );
    
    // Call onFinish after animations complete
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  
  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value
  }));

  return (
    <LinearGradient
      colors={['#131313', '#1F1F1F']}
      style={styles.container}
    >
      {/* Background gradient circles */}
      <GradientCircle 
        style={{ position: 'absolute', top: 80, right: -60 }}
        colors={['rgba(59, 223, 240, 0.2)', 'transparent']}
        size={180}
      />
      <GradientCircle 
        style={{ position: 'absolute', top: 40, left: -60 }}
        colors={['rgba(74, 15, 235, 0.3)', 'transparent']}
        size={160}
      />
      <GradientCircle 
        style={{ position: 'absolute', bottom: 100, left: 100 }}
        colors={['rgba(74, 15, 235, 0.3)', 'transparent']}
        size={140}
      />
      
      <View style={styles.contentContainer}>
        <Animated.Image 
          source={require('../../assets/images/logo.png')} 
          style={[styles.logo, logoAnimatedStyle]} 
          resizeMode="contain"
        />
        
        <Animated.Text style={[styles.logoText, textAnimatedStyle]}>
          Üstat AI
        </Animated.Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientCircleContainer: {
    overflow: 'hidden',
    zIndex: 0,
  },
  gradientCircle: {
    opacity: 0.8,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logoContainer: {
    marginRight: 6,
  },
  logo: {
    width: 110,
    height: 110,
    marginRight: -10,
  },
  logoText: {
    fontSize: 35,
    fontWeight: '700',
    color: 'white',
    marginLeft: -6,
  }
});

export default SplashScreen;