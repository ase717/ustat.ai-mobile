import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Text, TextInput, Button, Snackbar } from 'react-native-paper';
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
import { authService } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Gradient circle component
const GradientCircle = ({ style, colors, size = 160 }) => (
  <View style={[styles.gradientCircleContainer, style]}>
    <LinearGradient
      colors={colors}
      style={[styles.gradientCircle, { width: size, height: size, borderRadius: size / 2 }]}
    />
  </View>
);

const LoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseVisible, setResponseVisible] = useState(false);
  const [responseType, setResponseType] = useState('info'); // 'success', 'error', 'info'
  
  // Animation values
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  
  // Start animation when component mounts
  useEffect(() => {
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

  useEffect(() => {
    // Check if email was passed from registration
    if (route.params?.email) {
      setEmail(route.params.email);
    }
  }, [route.params]);

  const showResponse = (message, type = 'info') => {
    setResponseMessage(message);
    setResponseType(type);
    setResponseVisible(true);
  };

  const hideResponse = () => {
    setResponseVisible(false);
  };

  const handleLogin = async () => {
    // Form validation
    if (!email.trim() || !password.trim()) {
      setError('Lütfen e-posta ve şifrenizi girin');
      showResponse('Lütfen e-posta ve şifrenizi girin', 'error');
      return;
    }

    // Prepare login data
    const credentials = {
      email,
      password,
    };

    try {
      setError(null);
      setLoading(true);
      dispatch(loginStart());
      
      // Make the API call
      const response = await authService.login(credentials);
      
      // Handle success
      console.log('Login successful:', response.data);
      
      const { user, accessToken, refreshToken } = response.data;
      
      // Save tokens
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      
      // Update Redux
      dispatch(loginSuccess({
        user: user,
        token: accessToken
      }));
      
      setLoading(false);
      showResponse('Giriş başarılı!', 'success');
      
      // Navigate to main app
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }, 1000);
    } catch (error) {
      setLoading(false);
      
      // Extract error message
      let errorMessage = 'Giriş sırasında bir hata oluştu';
      
      if (error.response) {
        // Server responded with error status
        console.log('Error response:', error.response);
        
        // Different error handling based on status code
        if (error.response.status === 400) {
          errorMessage = 'Geçersiz bilgiler: ' + (error.response.data?.message || 'Giriş bilgilerinizi kontrol edin');
        } else if (error.response.status === 401) {
          errorMessage = 'E-posta adresi veya şifre hatalı';
        } else if (error.response.status === 403) {
          errorMessage = 'Hesabınız askıya alınmış';
        } else if (error.response.status === 422) {
          errorMessage = 'Doğrulama hatası: ' + (error.response.data?.message || 'Giriş bilgilerinizi kontrol edin');
        } else if (error.response.status === 500) {
          errorMessage = 'Sunucu hatası: Lütfen daha sonra tekrar deneyin';
        }
      } else if (error.request) {
        // Request was made but no response
        errorMessage = 'Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin';
      }
      
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
      showResponse(errorMessage, 'error');
    }
  };

  return (
    <LinearGradient
      colors={['rgb(18, 12, 36)', 'rgb(30, 20, 60)']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#12102a" />
      
      {/* Background gradient circles */}
      <GradientCircle 
        style={{ position: 'absolute', top: 80, left: -40 }}
        colors={['rgba(106, 90, 205, 0.2)', 'transparent']}
        size={160}
      />
      <GradientCircle 
        style={{ position: 'absolute', top: 350, right: -60 }}
        colors={['rgba(106, 90, 205, 0.2)', 'transparent']}
        size={150}
      />
      
      {/* Back button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with logo */}
          <View style={styles.headerContainer}>
            <Image 
              source={require('../../../assets/images/logo.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={styles.title}>Üstat</Text>
            <Text style={styles.registerTitle}>Giriş Yap</Text>
            <Text style={styles.subtitle}>
              Bugün yeni bir gün. Senin günün. Onu sen şekillendir.
              {'\n'}Projelerini yönetmeye başlamak için giriş yap.
            </Text>
          </View>
          
          {/* Login form */}
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>E-posta</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="ornek@eposta.com"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                keyboardType="email-address"
                autoCapitalize="none"
                mode="flat"
                underlineColor="transparent"
                textColor="white"
                theme={{ colors: { onSurfaceVariant: 'white' } }}
              />
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Parola</Text>
              <TextInput
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
                placeholder="Parolanızı girin"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                mode="flat"
                underlineColor="transparent"
                textColor="white"
                theme={{ colors: { onSurfaceVariant: 'white' } }}
              />
            </View>
            
            <TouchableOpacity
              style={styles.forgotPasswordLink}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </TouchableOpacity>
            
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              labelStyle={styles.buttonText}
              loading={loading}
              disabled={loading}
              buttonColor="#6C4EE0"
            >
              Giriş Yap
            </Button>
            
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Hesabınız yok mu? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLinkText}>Kayıt ol</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Response message */}
      <Snackbar
        visible={responseVisible}
        onDismiss={hideResponse}
        duration={3000}
        style={[
          styles.snackbar,
          responseType === 'success' && styles.successSnackbar,
          responseType === 'error' && styles.errorSnackbar
        ]}
      >
        {responseMessage}
      </Snackbar>
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
  logo: {
    width: 70,
    height: 70,
    marginBottom: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  registerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    marginTop: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 6,
    height: 55,
    fontSize: 16,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#6C4EE0',
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
    color: 'white',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  registerText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  registerLinkText: {
    color: '#6C4EE0',
    fontWeight: 'bold',
  },
  snackbar: {
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  successSnackbar: {
    backgroundColor: '#4CAF50',
  },
  errorSnackbar: {
    backgroundColor: '#F44336',
  },
});

export default LoginScreen;