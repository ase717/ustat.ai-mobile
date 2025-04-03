import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResetPassword = async () => {
    // Email validation
    if (!email.trim()) {
      setError('Lütfen e-posta adresinizi girin');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Geçerli bir e-posta adresi girin');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Mock API call
      setTimeout(() => {
        setIsSubmitted(true);
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.formContainer}>
        {!isSubmitted ? (
          <>
            <Text style={styles.title}>Şifremi Unuttum</Text>
            <Text style={styles.subtitle}>
              Kayıtlı e-posta adresinize şifre sıfırlama bağlantısı göndereceğiz.
            </Text>
            
            <TextInput
              label="E-Posta"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            <Button
              mode="contained"
              onPress={handleResetPassword}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Şifre Sıfırlama Bağlantısı Gönder
            </Button>
            
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.backLink}
            >
              <Text style={styles.linkText}>Giriş ekranına dön</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={64} color={colors.success.main} />
              <Text style={styles.successTitle}>E-Posta Gönderildi</Text>
              <Text style={styles.successText}>
                Şifre sıfırlama talimatları {email} adresine gönderildi. Lütfen e-posta kutunuzu kontrol edin.
              </Text>
              
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Login')}
                style={styles.successButton}
              >
                Giriş Ekranına Dön
              </Button>
            </View>
          </>
        )}
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
    marginBottom: 12,
    textAlign: 'center',
    color: colors.text.primary,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: colors.text.secondary,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.background.default,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  backLink: {
    marginTop: 16,
    alignSelf: 'center',
  },
  linkText: {
    color: colors.primary.main,
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.error.main,
    marginBottom: 10,
  },
  successContainer: {
    alignItems: 'center',
    padding: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    color: colors.text.primary,
  },
  successText: {
    textAlign: 'center',
    marginBottom: 24,
    color: colors.text.secondary,
  },
  successButton: {
    width: '100%',
  },
});

export default ForgotPasswordScreen;