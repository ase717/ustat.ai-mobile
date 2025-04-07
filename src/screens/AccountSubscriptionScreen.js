import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';

const AccountSubscriptionScreen = ({ navigation }) => {
  // The error is here - create a default object to handle undefined user
  const { user = {} } = useSelector((state) => state.auth || {});
  
  // Mock subscription data
  const subscription = {
    plan: 'Pro Plan',
    status: 'Aktif',
    renewalDate: '15 Mayıs 2025',
    price: '199,00 ₺',
    features: [
      'Sınırsız Hesaplama',
      'Sınırsız Döküman Erişimi',
      'Öncelikli Destek',
      'Gelişmiş AI Özellikleri'
    ]
  };
  
  // Mock billing history
  const billingHistory = [
    {
      id: '1',
      date: '15 Nisan 2025',
      amount: '199,00 ₺',
      status: 'Ödendi',
      description: 'Pro Plan - Aylık'
    },
    {
      id: '2',
      date: '15 Mart 2025',
      amount: '199,00 ₺',
      status: 'Ödendi',
      description: 'Pro Plan - Aylık'
    },
    {
      id: '3',
      date: '15 Şubat 2025',
      amount: '199,00 ₺',
      status: 'Ödendi',
      description: 'Pro Plan - Aylık'
    }
  ];

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
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hesap ve Abonelik</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Account Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Hesap Bilgileri</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ad Soyad:</Text>
              <Text style={styles.infoValue}>{user?.firstName || ''} {user?.lastName || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>E-posta:</Text>
              <Text style={styles.infoValue}>{user?.email || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Üyelik Tarihi:</Text>
              <Text style={styles.infoValue}>1 Ocak 2025</Text>
            </View>
          </Card.Content>
        </Card>
        
        {/* Current Subscription */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Mevcut Abonelik</Text>
            <View style={styles.subscriptionHeader}>
              <View>
                <Text style={styles.planName}>{subscription.plan}</Text>
                <Text style={styles.planStatus}>{subscription.status}</Text>
              </View>
              <Text style={styles.planPrice}>{subscription.price} / ay</Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.renewalInfo}>
              <Text style={styles.renewalText}>
                Aboneliğiniz <Text style={styles.renewalDate}>{subscription.renewalDate}</Text> tarihinde yenilenecek.
              </Text>
            </View>
            
            <Text style={styles.featuresTitle}>Planınıza dahil özellikler:</Text>
            {subscription.features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary.main} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
            
            <View style={styles.buttonRow}>
              <Button 
                mode="outlined" 
                style={styles.planButton}
                labelStyle={styles.planButtonLabel}
                onPress={() => {}}
              >
                Planı Değiştir
              </Button>
              <Button 
                mode="outlined" 
                style={[styles.planButton, styles.cancelButton]}
                labelStyle={styles.cancelButtonLabel}
                onPress={() => {}}
              >
                İptal Et
              </Button>
            </View>
          </Card.Content>
        </Card>
        
        {/* Billing History */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Ödeme Geçmişi</Text>
            {billingHistory.map((item, index) => (
              <React.Fragment key={item.id}>
                <View style={styles.billingItem}>
                  <View>
                    <Text style={styles.billingDate}>{item.date}</Text>
                    <Text style={styles.billingDesc}>{item.description}</Text>
                  </View>
                  <View style={styles.billingRight}>
                    <Text style={styles.billingAmount}>{item.amount}</Text>
                    <Text style={styles.billingStatus}>{item.status}</Text>
                  </View>
                </View>
                {index < billingHistory.length - 1 && <Divider style={styles.divider} />}
              </React.Fragment>
            ))}
            
            <Button 
              mode="text" 
              onPress={() => {}}
              style={styles.viewAllButton}
              labelStyle={styles.viewAllButtonLabel}
            >
              Tümünü Görüntüle
            </Button>
          </Card.Content>
        </Card>
        
        {/* Payment Methods */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Ödeme Yöntemleri</Text>
            <View style={styles.paymentMethod}>
              <View style={styles.paymentMethodLeft}>
                <Ionicons name="card-outline" size={24} color={colors.text.primary} />
                <View style={styles.paymentMethodDetails}>
                  <Text style={styles.paymentMethodType}>Visa ****1234</Text>
                  <Text style={styles.paymentMethodExpiry}>Son kullanma: 12/25</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.paymentMethodEdit}>Düzenle</Text>
              </TouchableOpacity>
            </View>
            
            <Button 
              mode="outlined" 
              style={styles.addPaymentButton}
              labelStyle={styles.addPaymentButtonLabel}
              onPress={() => {}}
              icon="plus"
            >
              Yeni Ödeme Yöntemi Ekle
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
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
    padding: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  planStatus: {
    fontSize: 14,
    color: colors.primary.main,
    marginTop: 4,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  divider: {
    backgroundColor: colors.grey[200],
    marginVertical: 16,
  },
  renewalInfo: {
    backgroundColor: 'rgba(106, 90, 205, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  renewalText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  renewalDate: {
    fontWeight: 'bold',
  },
  featuresTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
    color: colors.text.primary,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  planButton: {
    flex: 1,
    marginHorizontal: 4,
    borderColor: colors.primary.main,
  },
  planButtonLabel: {
    color: colors.primary.main,
  },
  cancelButton: {
    borderColor: colors.error,
  },
  cancelButtonLabel: {
    color: colors.error,
  },
  billingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  billingDate: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
  },
  billingDesc: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  billingRight: {
    alignItems: 'flex-end',
  },
  billingAmount: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
  },
  billingStatus: {
    fontSize: 14,
    color: colors.success,
    marginTop: 4,
  },
  viewAllButton: {
    marginTop: 8,
  },
  viewAllButtonLabel: {
    color: colors.primary.main,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodDetails: {
    marginLeft: 12,
  },
  paymentMethodType: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
  },
  paymentMethodExpiry: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  paymentMethodEdit: {
    fontSize: 14,
    color: colors.primary.main,
  },
  addPaymentButton: {
    marginTop: 8,
    borderColor: colors.primary.main,
  },
  addPaymentButtonLabel: {
    color: colors.primary.main,
  },
});

export default AccountSubscriptionScreen;
