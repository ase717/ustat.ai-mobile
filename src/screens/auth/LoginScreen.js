import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/authSlice';
import colors from '../../theme/colors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
      // In a real app, you would make an API call here
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
    <View style={styles.container}>
      <Surface style={styles.formContainer}>
        <Text style={styles.title}>Giriş Yap</Text>
        
        <TextInput
          label="E-Posta"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
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
            />
          }
          style={styles.input}
        />
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Giriş Yap
        </Button>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.textLink}
        >
          <Text style={styles.linkText}>Şifremi Unuttum</Text>
        </TouchableOpacity>
        
        <View style={styles.registerContainer}>
          <Text>Hesabınız yok mu? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background.default,
  },
  formContainer: {
    padding: 20,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text.primary,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.background.default,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  textLink: {
    marginTop: 16,
    alignSelf: 'center',
  },
  linkText: {
    color: colors.primary.main,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  errorText: {
    color: colors.error.main,
    marginBottom: 10,
  },
});

export default LoginScreen;