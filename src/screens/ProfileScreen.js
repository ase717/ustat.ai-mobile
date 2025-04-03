import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Button, TextInput, Divider, Surface, Switch, List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, logout } from '../redux/authSlice';
import Header from '../components/Header';
import colors from '../theme/colors';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { userSubscription } = useSelector(state => state.subscription);
  
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  
  const handleSaveProfile = () => {
    dispatch(updateUser({
      name,
      email,
      phone,
      settings: {
        emailNotifications,
        pushNotifications
      }
    }));
    setEditing(false);
  };
  
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <Header title="Profil" />
      
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>{user?.name?.charAt(0) || 'U'}</Text>
              </View>
            )}
            
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="camera" size={20} color={colors.common.white} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>{user?.name || 'Kullanıcı'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'kullanici@example.com'}</Text>
          
          {userSubscription ? (
            <View style={styles.subscriptionContainer}>
              <Text style={styles.subscriptionLabel}>Mevcut Paket</Text>
              <View style={styles.subscriptionBadge}>
                <Text style={styles.subscriptionText}>{userSubscription?.name || 'Premium'}</Text>
              </View>
            </View>
          ) : (
            <Button
              mode="contained"
              style={styles.subscribeButton}
              onPress={() => navigation.navigate('Packages')}
            >
              Paket Satın Al
            </Button>
          )}
        </Surface>
        
        <Surface style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profil Bilgileri</Text>
            {!editing && (
              <Button
                mode="text"
                onPress={() => setEditing(true)}
                style={styles.editButton}
              >
                Düzenle
              </Button>
            )}
          </View>
          
          {editing ? (
            <View style={styles.editForm}>
              <TextInput
                label="Ad Soyad"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              
              <TextInput
                label="E-posta"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput
                label="Telefon"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="phone-pad"
              />
              
              <View style={styles.buttonsContainer}>
                <Button
                  mode="text"
                  onPress={() => setEditing(false)}
                  style={styles.cancelButton}
                >
                  İptal
                </Button>
                
                <Button
                  mode="contained"
                  onPress={handleSaveProfile}
                  style={styles.saveButton}
                >
                  Kaydet
                </Button>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Ad Soyad</Text>
                <Text style={styles.infoValue}>{user?.name || 'Belirtilmemiş'}</Text>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>E-posta</Text>
                <Text style={styles.infoValue}>{user?.email || 'Belirtilmemiş'}</Text>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Telefon</Text>
                <Text style={styles.infoValue}>{user?.phone || 'Belirtilmemiş'}</Text>
              </View>
            </View>
          )}
        </Surface>
        
        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirim Ayarları</Text>
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>E-posta Bildirimleri</Text>
              <Text style={styles.settingDescription}>Güncellemeler ve duyurular için e-posta al</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              color={colors.primary.main}
            />
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Push Bildirimleri</Text>
              <Text style={styles.settingDescription}>Anlık bildirimler al</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              color={colors.primary.main}
            />
          </View>
        </Surface>
        
        <Surface style={styles.section}>
          <List.Item
            title="Şifre Değiştir"
            left={props => <List.Icon {...props} icon="lock" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('ChangePassword')}
          />
          
          <Divider />
          
          <List.Item
            title="Ödeme Yöntemleri"
            left={props => <List.Icon {...props} icon="credit-card" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('PaymentMethods')}
          />
          
          <Divider />
          
          <List.Item
            title="Fatura Geçmişi"
            left={props => <List.Icon {...props} icon="file-document" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('BillingHistory')}
          />
        </Surface>
        
        <View style={styles.logoutButtonContainer}>
          <Button 
            mode="outlined" 
            onPress={handleLogout}
            style={styles.logoutButton}
            contentStyle={styles.logoutButtonContent}
            icon="logout"
          >
            Çıkış Yap
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    color: colors.common.white,
    fontSize: 40,
    fontWeight: 'bold',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary.dark,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.common.white,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: colors.text.secondary,
    marginBottom: 16,
  },
  subscriptionContainer: {
    alignItems: 'center',
  },
  subscriptionLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: colors.text.secondary,
  },
  subscriptionBadge: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
  },
  subscriptionText: {
    color: colors.common.white,
    fontWeight: 'bold',
  },
  subscribeButton: {
    marginTop: 8,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    marginRight: -8,
  },
  profileInfo: {
    
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoLabel: {
    color: colors.text.secondary,
  },
  infoValue: {
    fontWeight: '500',
  },
  divider: {
    backgroundColor: colors.grey[200],
  },
  editForm: {
    
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.background.default,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelButton: {
    marginRight: 8,
  },
  saveButton: {
    
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  logoutButtonContainer: {
    padding: 16,
    marginBottom: 24,
  },
  logoutButton: {
    borderColor: colors.error.main,
  },
  logoutButtonContent: {
    paddingVertical: 4,
  },
});

export default ProfileScreen;