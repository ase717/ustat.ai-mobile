import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  StatusBar,
  ScrollView
} from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Animation values
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  
  // Start animation when component mounts
  React.useEffect(() => {
    formOpacity.value = withTiming(1, { duration: 800 });
    formTranslateY.value = withTiming(0, { duration: 800 });
  }, []);
  
  // Animated style
  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ translateY: formTranslateY.value }]
    };
  });
  
  const dispatch = useDispatch();

  const handleLogin = async () => {
    // Form validation
    if (!email.trim() || !password.trim()) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      setLoading(true);
      dispatch(loginStart());
      
      // Mock login for demo purposes
      setTimeout(() => {
        // Simulate successful login
        const mockUser = {
          id: '1',
          email,
          name: 'Test User',
        };
        
        const mockToken = 'mock-jwt-token';
        
        dispatch(loginSuccess({ user: mockUser, token: mockToken }));
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      dispatch(loginFailure(error.message));
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#131313', '#1F1F1F']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#131313" />
      
      {/* Background gradient circles */}
      <GradientCircle 
        style={{ position: 'absolute', top: 60, right: -60 }}
        colors={['rgba(65, 41, 112, 0.67)', 'transparent']}
        size={160}
      />
      <GradientCircle 
        style={{ position: 'absolute', top: 350, left: -50 }}
        colors={['rgba(15, 74, 235, 0.3)', 'transparent']}
        size={150}
      />
      
      {/* Back button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with logo */}
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../../assets/images/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.headerText}>Üstat</Text>
          
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Giriş Yap</Text>
          <Text style={styles.subtitle}>Bugün yeni bir gün. Senin günün. Onu sen şekillendir. Projelerini yönetmeye başlamak için giriş yap.</Text>
        </View>
        
        {/* Login form */}
        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          <TextInput
            label="E-Posta"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            outlineColor="rgba(255, 255, 255, 0.2)"
            activeOutlineColor={colors.primary.main}
            textColor="white"
            theme={{ colors: { onSurfaceVariant: 'rgba(255, 255, 255, 0.7)' } }}
          />
          
          <TextInput
            label="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
                color="rgba(255, 255, 255, 0.7)"
              />
            }
            style={styles.input}
            mode="outlined"
            outlineColor="rgba(255, 255, 255, 0.2)"
            activeOutlineColor={colors.primary.main}
            textColor="white"
            theme={{ colors: { onSurfaceVariant: 'rgba(255, 255, 255, 0.7)' } }}
          />
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPasswordLink}
          >
            <Text style={styles.linkText}>Şifremi Unuttum</Text>
          </TouchableOpacity>
          
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.loginButton}
            labelStyle={styles.buttonText}
            loading={loading}
            disabled={loading}
          >
            Giriş Yap
          </Button>
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Hesabınız yok mu? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => navigation.navigate('Welcome')}
          >
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientCircleContainer: {
    overflow: 'hidden',
    zIndex: 0,
  },
  gradientCircle: {
    opacity: 0.8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 1,
  },
  headerText: {
    fontSize: 23,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  linkText: {
    color: colors.primary.main,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 30,
    paddingVertical: 8,
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  registerText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
  },
  errorText: {
    color: colors.error.main,
    marginBottom: 16,
  },
});

export default LoginScreen;