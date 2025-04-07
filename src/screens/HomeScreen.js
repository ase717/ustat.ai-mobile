import React from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Text, Button, Appbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors.js';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const GradientCircle = ({ style, colors, size = 160 }) => (
  <View style={[styles.gradientCircleContainer, style]}>
    <LinearGradient
      colors={colors}
      style={[styles.gradientCircle, { width: size, height: size, borderRadius: size / 2 }]}
    />
  </View>
);

const IconCard = ({ icon, title, description }) => (
  <View style={styles.iconCard}>
    <View style={styles.iconContainer}>
      {icon}
    </View>
    <Text style={styles.iconCardTitle}>{title}</Text>
    <Text style={styles.iconCardDescription}>{description}</Text>
  </View>
);

const ImageTextSection = ({ title, paragraphs, imagePosition = 'left', imageSource }) => (
  <View style={styles.imageTextSection}>
    <View style={styles.imageTextContainer}>
      {imageSource && (
        <Image source={imageSource} style={styles.sectionImage} resizeMode="contain" />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>{paragraph}</Text>
        ))}
      </View>
    </View>
  </View>
);

const HomeScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  
  return (
    <LinearGradient
      colors={['#131313', '#1F1F1F']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#131313" />
      
      {/* Header with logo and user info */}
      <Appbar.Header style={styles.header}>
        <View style={styles.logoHeader}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.logoHeaderText}>Üstat</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Hoş geldin, {user?.firstName || 'Kullanıcı'}</Text>
        </View>
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        {/* Background gradient circles */}
        <GradientCircle 
          style={{ position: 'absolute', top: 80, right: -60 }}
          colors={['rgba(59, 223, 240, 0.2)', 'transparent']}
          size={180}
        />
        <GradientCircle 
          style={{ position: 'absolute', top: 40, left: -60 }}
          colors={['rgba(74, 15, 235, 0.3)', 'transparent']}
          size={160}
        />
        <GradientCircle 
          style={{ position: 'absolute', top: 300, left: 100 }}
          colors={['rgba(74, 15, 235, 0.3)', 'transparent']}
          size={140}
        />

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Hukuki Araştırmanın Geleceği</Text>
            <Text style={styles.heroSubtitle}>
              Devrim yaratan yapay zeka ile avukatlara dijitalde rakipsiz hız, kesinlik ve verimlilik sunuyoruz.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Dashboard')}
            >
              <Text style={styles.buttonText}>Keşfet</Text>
            </Button>
            <Button
              mode="contained"
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Packages')}
            >
              <Text style={styles.buttonText}>Plan Seç</Text>
            </Button>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Smart Legal Technology Section */}
        <ImageTextSection
          title="Akıllı Hukuk Teknolojisi"
          paragraphs={[
            `Türkiye'de hukuk profesyonellerinin çalışma şeklini dönüştürmek amacıyla yola çıkan Üstat AI, hukuki araştırma, belge yönetimi ve hesaplama süreçlerinde yapay zeka destekli yenilikçi çözümler sunar.`,
            `Amacımız, avukatların karmaşık hukuki problemlere odaklanırken zaman ve emek tasarrufu yapmalarını sağlamak, onlara Türkiye'nin en kapsamlı ve akıllı hukuki çalışma ortamını sunmaktır.`
          ]}
          imagePosition="center"
          imageSource={require('../../assets/images/image2.png')}
        />

        <View style={styles.divider} />

        {/* Information Cards Section */}
        <View style={styles.cardsSection}>
          <Text style={styles.sectionTitle}>Hukuki Süreçlerinizi Güçlendiren Özellikler</Text>
          <Text style={styles.sectionDescription}>Tek platformda derinlemesine arama, anında hesaplama, akıllı belge üretimi ve etkili proje yönetimi ile hukuki sürecinizi yeniden tanımlayın.</Text>
          <View style={styles.cardsContainer}>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Anlamsal ve Bağlamsal Arama</Text>
              <Text style={styles.infoCardDescription}>İçtihat ve Literatür araştırmalarını yapay zeka destekli hibrit arama teknolojisi ile tamamlayın.</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Yapay Zeka ile Hukuki Hesaplama</Text>
              <Text style={styles.infoCardDescription}>İnfaz, tazminat, işçilik alacakları gibi karmaşık hesaplamaları saniyeler içinde tamamlayın.</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Hukuki Proje Yönetimi</Text>
              <Text style={styles.infoCardDescription}>Müvekkilleriniz için araştırma projeleri oluşturun. Projelerinize içtihat, literatür, hesaplama ve dilekçe kaydedin.</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Akıllı Belge Üretimi</Text>
              <Text style={styles.infoCardDescription}>Dilekçe ve sözleşmeleri, yapay zeka destekli akıllı belge üretimi ile oluşturun ve mevcut belgelerinizi analiz edin.</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Icon Cards Section - "Why Ustat AI?" */}
        <View style={styles.iconCardsSection}>
          <Text style={styles.sectionTitle}>Neden Üstat AI?</Text>
          <Text style={styles.sectionDescription}>
            Türkiye'nin hukuki ihtiyaçlarına özel tasarlanmış, zamandan tasarruf sağlayan ve güncel veriyle güçlendirilmiş yerel odaklı dijital hukuk çözümü.
          </Text>
          
          <View style={styles.iconCardsContainer}>
            <IconCard
              icon={<Ionicons name="earth-outline" size={48} color={colors.primary.main} />}
              title="Yerel Odaklı, Küresel Teknoloji"
              description="Türkiye'nin hukuki ihtiyaçlarına özel tasarlandı. Yerel mevzuat, içtihatlar ve Türkçe dil yapısına hakim AI algoritmaları."
            />
            <IconCard
              icon={<Ionicons name="time-outline" size={48} color={colors.primary.main} />}
              title="Zaman Kazandıran Tasarım"
              description="Haftalarca süren araştırmaları saatlere, saatlerce süren hesaplamaları saniyelere indirin."
            />
            <IconCard
              icon={<Ionicons name="shield-checkmark-outline" size={48} color={colors.primary.main} />}
              title="Güvenilir ve Güncel Veri"
              description="Anlık mevzuat güncellemeleri, Yargıtay kararları ve akademik kaynaklara erişim."
            />
          </View>
        </View>
      </ScrollView>
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
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
    justifyContent: 'space-between',
  },
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  logoHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    padding: 20,
    paddingTop: 180,
    paddingBottom: 100,
    alignItems: 'center',
  },
  heroContent: {
    marginBottom: 30,
    alignItems: 'center',
  },
  smallTitle: {
    fontSize: 16,
    color: colors.primary.main,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 18,
    marginRight: 16,
    paddingHorizontal: 20,
  },
  secondaryButton: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 18,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 40,
  },
  imageTextSection: {
    paddingHorizontal: 20,
  },
  imageTextContainer: {
    flexDirection: 'column',
  },
  sectionImage: {
    width: '100%',
    height: 230,
    marginBottom: 24,
  },
  textContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    marginTop: 15,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
    marginBottom: 16,
  },
  cardsSection: {
    paddingHorizontal: 20,
  },
  sectionDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
    marginBottom: 24,
  },
  cardsContainer: {
    marginTop: 24,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  infoCardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  iconCardsSection: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  iconCardsContainer: {
    marginTop: 24,
  },
  iconCard: {
    marginBottom: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  iconCardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
});

export default HomeScreen; 