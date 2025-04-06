import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';
import colors from '../../theme/colors';

// Gradient circle component
const GradientCircle = ({ style, colors, size = 160 }) => (
  <View style={[styles.gradientCircleContainer, style]}>
    <LinearGradient
      colors={colors}
      style={[styles.gradientCircle, { width: size, height: size, borderRadius: size / 2 }]}
    />
  </View>
);

const AuthScreen = ({ navigation }) => {
  // Animation values
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  
  // Start animation when component mounts
  React.useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 800 });
    contentTranslateY.value = withTiming(0, { duration: 800 });
  }, []);
  
  // Animated style
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }]
    };
  });
  
  return (
    <LinearGradient
      colors={['#131313', '#1F1F1F']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#131313" />
      
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
      
      {/* Logo and Header */}
      <Animated.View style={[styles.logoContainer, contentAnimatedStyle]}>
        <Image 
          source={require('../../../assets/images/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.title}>Üstat AI</Text>
        <Text style={styles.subtitle}>Hukuki Araştırmanın Geleceği</Text>
      </Animated.View>
      
      {/* Buttons */}
      <Animated.View style={[styles.buttonContainer, contentAnimatedStyle]}>
        <Button
          mode="contained"
          style={styles.registerButton}
          labelStyle={styles.buttonText}
          onPress={() => navigation.navigate('Register')}
        >
          Kayıt Ol
        </Button>
        
        <Button
          mode="outlined"
          style={styles.loginButton}
          labelStyle={styles.buttonText}
          onPress={() => navigation.navigate('Login')}
        >
          Giriş Yap
        </Button>
        
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.skipText}>Uygulamayı Keşfet</Text>
        </TouchableOpacity>
      </Animated.View>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    maxWidth: '80%',
  },
  buttonContainer: {
    width: '85%',
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 30,
    width: '100%',
    marginBottom: 16,
    paddingVertical: 8,
  },
  loginButton: {
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 30,
    width: '100%',
    marginBottom: 30,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 10,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  }
});

export default AuthScreen;
