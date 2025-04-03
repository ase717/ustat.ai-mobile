import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Surface, Checkbox } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/authSlice';
import colors from '../../theme/colors';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();

  const handleRegister = async () => {
    // Form validation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (!agreeTerms) {
      setError('Kullanım koşullarını kabul etmelisiniz');
      return;
    }

    try {
      setLoading(true);
      
      // Mock registration for demo purposes
      // In a real app, you would make an API call here
      setTimeout(() => {
        // Simulate successful registration
        const mockUser = {
          id: '1',
          name,
          email,
        };
        
        const mockToken = 'mock-jwt-token';
        
        dispatch(loginSuccess({ user: mockUser, token: mockToken }));
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.formContainer}>
        <Text style={styles.title}>Kayıt Ol</Text>
        
        <TextInput
          label="Ad Soyad"
          value={name}
          onChangeText={setName}
          style={styles.input}
          autoCapitalize="words"
        />
        
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
        
        <TextInput
          label="Şifre Tekrar"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={agreeTerms ? 'checked' : 'unchecked'}
            onPress={() => setAgreeTerms(!agreeTerms)}
            color={colors.primary.main}
          />
          <View style={styles.termsTextContainer}>
            <Text>
              <Text>Kullanım koşullarını ve </Text>
              <Text style={styles.linkText}>Gizlilik Politikasını</Text>
              <Text> kabul ediyorum</Text>
            </Text>
          </View>
        </View>
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Kayıt Ol
        </Button>
        
        <View style={styles.loginContainer}>
          <Text>Zaten hesabınız var mı? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  formContainer: {
    margin: 20,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  termsTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  linkText: {
    color: colors.primary.main,
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.error.main,
    marginBottom: 10,
  },
});

export default RegisterScreen;