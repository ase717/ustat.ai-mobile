import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar
} from 'react-native';
import { Text, Card, Searchbar, Divider, Menu, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../theme/colors';
import { logoutSuccess } from '../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const dispatch = useDispatch();

  // Categories for calculations
  const calculationCategories = [
    {
      id: 'category1',
      title: 'Hukuk',
      icon: 'hammer-outline',
      items: [
        { id: 'calc1', name: 'İnfaz', screen: 'InfazScreen' },
        { id: 'calc2', name: 'Vekalet Ücreti', screen: 'VekaletUcretiScreen' },
        { id: 'calc3', name: 'Harç ve Gider', screen: 'HarcGiderScreen' },
      ]
    },
    {
      id: 'category2',
      title: 'İş',
      icon: 'briefcase-outline',
      items: [
        { id: 'calc4', name: 'Maaş', screen: 'MaasScreen' },
        { id: 'calc5', name: 'İşçilik Alacağı', screen: 'IscilikAlacaklariScreen' },
        { id: 'calc6', name: 'İş Kazası', screen: 'IsKazasiScreen' },
      ]
    },
    {
      id: 'category3',
      title: 'Kaza',
      icon: 'car-outline',
      items: [
        { id: 'calc8', name: 'Trafik Kazası', screen: 'TrafikKazasiScreen' },
      ]
    },
  ];

  const handleLogout = async () => {
    try {
      // Clear tokens
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      
      // Update Redux state
      dispatch(logoutSuccess());
      
      // Close menu
      setMenuVisible(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigateToProfileSettings = () => {
    setMenuVisible(false);
    navigation.navigate('ProfileSettings');
  };

  const navigateToAccountSubscription = () => {
    setMenuVisible(false);
    navigation.navigate('AccountSubscription');
  };

  const navigateToCalculation = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoHeader}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.headerTitle}>Üstat</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color={colors.primary.main} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Text style={styles.welcomeText}>Hoş Geldiniz, {user?.firstName || 'Kullanıcı'}!</Text>
            
            <Searchbar
              placeholder="Hesaplama veya işlem ara"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
              iconColor={colors.primary.main}
            />
          </Card.Content>
        </Card>

          <Text style={styles.sectionHeader}>Hesaplamalar</Text>

        {calculationCategories.map((category) => (
          <Card key={category.id} style={styles.categoryCard}>
            <Card.Content>
              <View style={styles.categoryHeader}>
                <Ionicons name={category.icon} size={24} color={colors.primary.main} />
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>
              
              <Divider style={styles.divider} />
              
              {category.items.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.calculationItem}
                  onPress={() => navigateToCalculation(item.screen)}
                >
                  <Text style={styles.calculationItemText}>{item.name}</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.grey[500]} />
                </TouchableOpacity>
              ))}
            </Card.Content>
          </Card>
        ))}
        
      </ScrollView>
      
      {/* Profile Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={navigateToProfileSettings}>
              <Ionicons name="person-outline" size={24} color={colors.text.primary} />
              <Text style={styles.menuItemText}>Profil Ayarları</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={navigateToAccountSubscription}>
              <Ionicons name="card-outline" size={24} color={colors.text.primary} />
              <Text style={styles.menuItemText}>Hesap ve Abonelik</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              setMenuVisible(false);
              // Navigation to notification settings would go here
            }}>
              <Ionicons name="notifications-outline" size={24} color={colors.text.primary} />
              <Text style={styles.menuItemText}>Bildirim Ayarları</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              setMenuVisible(false);
              // Navigation to help and support would go here
            }}>
              <Ionicons name="help-circle-outline" size={24} color={colors.text.primary} />
              <Text style={styles.menuItemText}>Yardım ve Destek</Text>
            </TouchableOpacity>
            
            <Divider style={styles.menuDivider} />
            
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color={colors.error} />
              <Text style={[styles.menuItemText, {color: colors.error}]}>Çıkış yap</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 10,
  },
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  welcomeCard: {
    margin: 20,
    borderRadius: 8,
    elevation: 4,
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: colors.grey[100],
    borderRadius: 8,
    marginBottom: 6,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 5,
    marginBottom: 10,
  },
  categoryCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    color: colors.text.secondary,
  },
  divider: {
    backgroundColor: colors.grey[200],
    marginVertical: 8,
  },
  calculationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  calculationItemText: {
    fontSize: 16,
  },
  usageCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: colors.primary.main,
  },
  usageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usageItem: {
    alignItems: 'center',
  },
  usageValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  usageLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: '70%',
    height: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    paddingVertical: 50,
    paddingHorizontal: 5,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 18,
    marginLeft: 14,
    color: colors.text.primary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.grey[200],
    marginVertical: 8,
  },
});

export default DashboardScreen;