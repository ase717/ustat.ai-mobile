import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import Header from '../components/Header';
import PackageCard from '../components/PackageCard';
import colors from '../theme/colors';

const PackagesScreen = ({ navigation }) => {
  const packages = [
    {
      id: 1,
      title: 'Ücretsiz',
      description: 'Temel hukuki sorulara yanıt almak için',
      price: '0 TL',
      features: [
        'Günlük 5 soru sorma hakkı',
        'Temel hukuki bilgilere erişim',
        'Mobil uygulama erişimi'
      ],
      popular: false
    },
    {
      id: 2,
      title: 'Pro',
      description: 'Daha kapsamlı hukuki destek için',
      price: '199 TL',
      features: [
        'Sınırsız soru sorma hakkı',
        'Belge analizi (aylık 3 adet)',
        'Özel yasal içeriklere erişim',
        'Öncelikli destek',
        'Mobil ve web uygulaması erişimi'
      ],
      popular: true
    },
    {
      id: 3,
      title: 'Premium',
      description: 'Profesyonel hukuki danışmanlık için',
      price: '399 TL',
      features: [
        'Sınırsız soru sorma hakkı',
        'Belge analizi (sınırsız)',
        'Tüm yasal içeriklere erişim',
        'Öncelikli özel destek',
        'Avukatlarla görüşme fırsatı',
        'Mobil ve web uygulaması erişimi'
      ],
      popular: false
    }
  ];

  return (
    <View style={styles.container}>
      <Header title="Paketler" showBackButton />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Sizin İçin En Uygun Paketi Seçin</Text>
          <Text style={styles.subtitle}>
            İhtiyaçlarınıza göre özelleştirilmiş paketlerimiz arasından seçim yapın
          </Text>
        </View>
        
        <View style={styles.packagesContainer}>
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              title={pkg.title}
              description={pkg.description}
              price={pkg.price}
              features={pkg.features}
              popular={pkg.popular}
              onPress={() => navigation.navigate('Payment', { packageId: pkg.id })}
            />
          ))}
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Ustat AI ile Avantajlar</Text>
          <Text style={styles.infoText}>
            Tüm paketlerde doğru, güncel ve güvenilir hukuki bilgilere erişim sağlarsınız.
            İhtiyaçlarınıza göre dilediğiniz zaman paket değişikliği yapabilirsiniz.
          </Text>
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
  headerSection: {
    padding: 20,
    backgroundColor: colors.primary.main,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.common.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.common.white,
    opacity: 0.9,
  },
  packagesContainer: {
    padding: 16,
  },
  infoSection: {
    padding: 20,
    backgroundColor: colors.grey[100],
    margin: 16,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    lineHeight: 22,
  }
});

export default PackagesScreen;