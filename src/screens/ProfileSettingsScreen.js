import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Text, TextInput, Button, Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const ProfileSettingsScreen = ({ navigation }) => {
  const { user = {} } = useSelector(state => state.auth || {});
  const dispatch = useDispatch();
  
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseVisible, setResponseVisible] = useState(false);
  const [responseType, setResponseType] = useState('info');
  
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

  const showResponse = (message, type = 'info') => {
    setResponseMessage(message);
    setResponseType(type);
    setResponseVisible(true);
  };

  const hideResponse = () => {
    setResponseVisible(false);
  };

  const handleUpdateProfile = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      showResponse('Lütfen tüm kişisel bilgileri doldurun', 'error');
      return;
    }

    setLoading(true);
    try {
      // Here you would call your API to update the user's profile
      // const response = await userService.updateProfile({ firstName, lastName, email, phone });
      
      // For now, let's just simulate a successful update
      setTimeout(() => {
        showResponse('Profil bilgileriniz başarıyla güncellendi', 'success');
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      showResponse('Profil güncellenirken bir hata oluştu', 'error');
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showResponse('Lütfen tüm şifre alanlarını doldurun', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showResponse('Yeni şifreler eşleşmiyor', 'error');
      return;
    }

    setLoading(true);
    try {
      // Here you would call your API to change the password
      // const response = await userService.changePassword({ currentPassword, newPassword });
      
      // For now, let's just simulate a successful password change
      setTimeout(() => {
        showResponse('Şifreniz başarıyla güncellendi', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      showResponse('Şifre değiştirilirken bir hata oluştu', 'error');
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  return (
    <LinearGradient
      colors={['rgb(18, 12, 36)', 'rgb(30, 20, 60)']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#12102a" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil Ayarları</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Ad</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
                placeholder="Adınız"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                mode="flat"
                underlineColor="transparent"
                textColor="white"
                theme={{ colors: { onSurfaceVariant: 'white' } }}
              />
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Soyad</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                style={styles.input}
                placeholder="Soyadınız"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                mode="flat"
                underlineColor="transparent"
                textColor="white"
                theme={{ colors: { onSurfaceVariant: 'white' } }}
              />
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>E-posta</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="E-posta adresiniz"
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
                placeholder="Telefon numaranız"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                keyboardType="phone-pad"
                mode="flat"
                underlineColor="transparent"
                textColor="white"
                theme={{ colors: { onSurfaceVariant: 'white' } }}
              />
            </View>
            
            <Button
              mode="contained"
              onPress={handleUpdateProfile}
              style={styles.saveButton}
              labelStyle={styles.buttonText}
              loading={loading}
              disabled={loading}
              buttonColor="#6C4EE0"
            >
              Bilgileri Güncelle
            </Button>
            
            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Şifre Değiştir</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Mevcut Şifre</Text>
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                right={
                  <TextInput.Icon
                    icon={showCurrentPassword ? "eye-off" : "eye"}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    color="rgba(255, 255, 255, 0.7)"
                  />
                }
                style={styles.input}
                placeholder="Mevcut şifreniz"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                mode="flat"
                underlineColor="transparent"
                textColor="white"
                theme={{ colors: { onSurfaceVariant: 'white' } }}
              />
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Yeni Şifre</Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                right={
                  <TextInput.Icon
                    icon={showNewPassword ? "eye-off" : "eye"}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    color="rgba(255, 255, 255, 0.7)"
                  />
                }
                style={styles.input}
                placeholder="Yeni şifreniz"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                mode="flat"
                underlineColor="transparent"
                textColor="white"
                theme={{ colors: { onSurfaceVariant: 'white' } }}
              />
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Yeni Şifre Tekrar</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? "eye-off" : "eye"}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    color="rgba(255, 255, 255, 0.7)"
                  />
                }
                style={styles.input}
                placeholder="Yeni şifrenizi tekrar girin"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                mode="flat"
                underlineColor="transparent"
                textColor="white"
                theme={{ colors: { onSurfaceVariant: 'white' } }}
              />
            </View>
            
            <Button
              mode="contained"
              onPress={handleChangePassword}
              style={styles.saveButton}
              labelStyle={styles.buttonText}
              loading={loading}
              disabled={loading}
              buttonColor="#6C4EE0"
            >
              Şifreyi Değiştir
            </Button>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    height: 50,
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 30,
  },
  snackbar: {
    marginBottom: 20,
  },
  successSnackbar: {
    backgroundColor: '#4CAF50',
  },
  errorSnackbar: {
    backgroundColor: '#F44336',
  },
});

export default ProfileSettingsScreen;
