import React, { useState } from 'react';
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
import { Text, TextInput, Button, Checkbox, Snackbar } from 'react-native-paper';
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

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseVisible, setResponseVisible] = useState(false);
  const [responseType, setResponseType] = useState('info'); // 'success', 'error', 'info'
  
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

  const showResponse = (message, type = 'info') => {
    setResponseMessage(message);
    setResponseType(type);
    setResponseVisible(true);
  };

  const hideResponse = () => {
    setResponseVisible(false);
  };

  const handleRegister = async () => {
    // Form validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Lütfen tüm alanları doldurun');
      showResponse('Lütfen tüm alanları doldurun', 'error');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      showResponse('Şifreler eşleşmiyor', 'error');
      return;
    }

    if (!agreeTerms) {
      setError('Kullanım koşullarını kabul etmelisiniz');
      showResponse('Kullanım koşullarını kabul etmelisiniz', 'error');
      return;
    }

    // Prepare user data
    const userData = {
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      password
    };

    try {
      setError(null);
      setLoading(true);
      
      // Register the user
      const registerResponse = await authService.register(userData);
      console.log('Registration successful:', registerResponse.data);
      
      // Registration successful
      setLoading(false);
      
      // Display success message
      showResponse('Kayıt başarılı! Giriş sayfasına yönlendiriliyor...', 'success');
      
      // Navigate to login screen with prefilled email
      setTimeout(() => {
        navigation.navigate('Login', { 
          email: email
        });
      }, 1500);
      
    } catch (error) {
      setLoading(false);
      console.log('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code
      });
      
      // Enhanced error handling
      let errorMessage = 'Kayıt sırasında bir hata oluştu';
      
      if (error.response) {
        // Server responded with error
        if (error.response.status === 400) {
          errorMessage = 'Geçersiz bilgiler: ' + (error.response.data?.message || 'Girdiğiniz bilgileri kontrol edin');
        } else if (error.response.status === 409) {
          errorMessage = 'Bu e-posta adresi zaten kullanılıyor';
        } else if (error.response.status === 422) {
          errorMessage = 'Doğrulama hatası: ' + (error.response.data?.message || 'Girdiğiniz bilgileri kontrol edin');
        } else if (error.response.status === 500) {
          errorMessage = 'Sunucu hatası: Lütfen daha sonra tekrar deneyin';
        } else {
          errorMessage = `Sunucu hatası (${error.response.status}): ${error.response.data?.message || 'Bilinmeyen hata'}`;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Bağlantı zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Ağ hatası: Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.';
      } else {
        errorMessage = 'Bağlantı hatası: ' + error.message;
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
            <Text style={styles.registerTitle}>Kayıt Ol</Text>
            <Text style={styles.subtitle}>
              Bugün yeni bir gün. Senin günün. Onu sen şekillendir.
              {'\n'}Yapay Zeka destekli hukuka erişmek için kayıt ol.
            </Text>
          </View>
          
          {/* Register form */}
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <Text style={styles.fieldLabel}>Ad</Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  style={styles.input}
                  placeholder="Adınız"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  autoCapitalize="words"
                  mode="flat"
                  underlineColor="transparent"
                  textColor="white"
                  theme={{ colors: { onSurfaceVariant: 'white' } }}
                />
              </View>
              
              <View style={styles.nameField}>
                <Text style={styles.fieldLabel}>Soyad</Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  style={styles.input}
                  placeholder="Soyadınız"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  autoCapitalize="words"
                  mode="flat"
                  underlineColor="transparent"
                  textColor="white"
                  theme={{ colors: { onSurfaceVariant: 'white' } }}
                />
              </View>
            </View>
            
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
              <Text style={styles.fieldLabel}>Telefon</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                placeholder="+90 555 555 55 55"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                keyboardType="phone-pad"
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
                secureTextEntry={true}
                style={styles.input}
                placeholder="En az 8 karakter"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                mode="flat"
                underlineColor="transparent"
                textColor="white"
                theme={{ colors: { onSurfaceVariant: 'white' } }}
              />
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Parola Tekrar</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
                style={styles.input}
                placeholder="Parolanızı tekrar girin"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                mode="flat"
                underlineColor="transparent"
                textColor="white"
                theme={{ colors: { onSurfaceVariant: 'white' } }}
              />
            </View>
            
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={agreeTerms ? 'checked' : 'unchecked'}
                onPress={() => setAgreeTerms(!agreeTerms)}
                color="#6C4EE0"
                uncheckedColor="rgba(255, 255, 255, 0.5)"
              />
              <View style={styles.termsTextContainer}>
                <Text style={styles.termsText}>
                  Üstat'ın <Text style={styles.linkText}>Kullanım Koşulları</Text>, <Text style={styles.linkText}>Gizlilik Politikası</Text> ve varsayılan <Text style={styles.linkText}>Bildirim Ayarları</Text>'nı kabul ediyorum.
                </Text>
              </View>
            </View>
            
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.registerButton}
              labelStyle={styles.buttonText}
              loading={loading}
              disabled={loading}
              buttonColor="#333"
            >
              Hesap Oluştur
            </Button>
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLinkText}>Giriş yap</Text>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  registerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
    marginTop: 2,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  nameField: {
    width: '48%',
  },
  fieldContainer: {
    marginBottom: 15,
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
    height: 58,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 16,
  },
  termsTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  termsText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
  linkText: {
    color: '#6C4EE0',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  registerButton: {
    borderRadius: 6,
    paddingVertical: 8,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  loginLinkText: {
    color: '#6C4EE0',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 16,
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

export default RegisterScreen;