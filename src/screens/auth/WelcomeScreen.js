import React from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Text, Button, Appbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../theme/colors.js';
import { Ionicons } from '@expo/vector-icons';

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

const WelcomeScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#131313', '#1F1F1F']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#131313" />
      
      {/* Header with logo and auth tabs */}
      <Appbar.Header style={styles.header}>
        <View style={styles.logoHeader}>
          <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.logoHeaderText}>Üstat</Text>
        </View>
        <View style={styles.authTabs}>
          <TouchableOpacity 
            style={styles.authButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.authButtonText}>Giriş</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.authButton} 
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.authButtonText}>Kayıt Ol</Text>
          </TouchableOpacity>
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
            <Text style={styles.smallTitle}>Üstat AI</Text>
            <Text style={styles.heroTitle}>Hukuki Araştırmanın Geleceği</Text>
            <Text style={styles.heroSubtitle}>
              Devrim yaratan yapay zeka ile avukatlara dijitalde rakipsiz hız, kesinlik ve verimlilik sunuyoruz.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Keşfet</Text>
            </Button>
            <Button
              mode="outlined"
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
          imagePosition="left"
          imageSource={require('../../../assets/images/image2.png')}
        />

        <View style={styles.divider} />

        {/* Information Cards Section */}
        <View style={styles.cardsSection}>
          <Text style={styles.sectionTitle}>Hukuki Süreçlerinizi Güçlendiren Özellikler</Text>
          <Text style={styles.sectionTitle}>Tek platformda derinlemesine arama, anında hesaplama, akıllı belge üretimi ve etkili proje yönetimi ile hukuki sürecinizi yeniden tanımlayın.</Text>
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

        {/* Modern and User-Focused Section */}
        <ImageTextSection
          title="Modern ve Kullanıcı Odaklı"
          paragraphs={[
            `Deneyimli avukatlarla iş birliği içinde geliştirilen modern, sade ve düzenli tasarımımız, gerçek hukuk uygulamasındaki bireysel ihtiyaçlara göre optimize edilmiştir.`,
            `Sadece aracımızla eski çağı geride bırakmıyor; geliştirme sürecimizle geleceğe yön vererek, işinizi kolaylaştıran ve daha fazla başarı getiren çözümler sunuyoruz.`,
            `Inovasyonun öncülerinden, adaletin savunucuları için.`
          ]}
          imagePosition="right"
          imageSource={require('../../../assets/images/image3.png')}
        />

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

        {/* Packages Section */}
        <View style={styles.packagesSection}>
          <Text style={styles.sectionTitle}>Paketler</Text>
          <View style={styles.cardsContainer}>
            <View style={styles.packageCard}>
              <Text style={styles.packagePrice}>1200₺</Text>
              <Text style={styles.packagePeriod}>/ Aylık</Text>
              <Text style={styles.packageTitle}>Temel Paket</Text>
              <Text style={styles.packageDescription}>Hukuki araştırma için.</Text>
              
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={24} color="#6C4EE0" />
                  <Text style={styles.featureText}>İçtihat Arama</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={24} color="#6C4EE0" />
                  <Text style={styles.featureText}>Literatür Arama</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="close-circle" size={24} color="#777" />
                  <Text style={[styles.featureText, styles.disabledFeature]}>Hesaplama Araçları</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="close-circle" size={24} color="#777" />
                  <Text style={[styles.featureText, styles.disabledFeature]}>Dilekçe Araçları</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="close-circle" size={24} color="#777" />
                  <Text style={[styles.featureText, styles.disabledFeature]}>Sözleşme Araçları</Text>
                </View>
              </View>
              
              <Button
                mode="contained"
                style={styles.packageSubscribeButton}
                onPress={() => {}}
              >
                <Text style={styles.packageButtonText}>Aboneliği Başlat</Text>
              </Button>
            </View>
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
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
    justifyContent: 'space-between',
  },
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  logoHeaderText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 6,
  },
  authTabs: {
    flexDirection: 'row',
  },
  authButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  gradientCircleContainer: {
    overflow: 'hidden',
    zIndex: 0,
  },
  gradientCircle: {
    opacity: 0.8,
  },
  heroSection: {
    paddingTop: 160,
    paddingBottom: 100,
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 1,
  },
  smallTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#E2E2E2',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 25,
    fontWeight: '700',
    paddingHorizontal: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    marginTop: 15,
    gap: 25,
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 10,
    flex: 1,
    maxWidth: 160,
  },
  secondaryButton: {
    borderColor: 'white',
    borderRadius: 30,
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
    maxWidth: 160,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 30,
  },
  imageTextSection: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  imageTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  sectionImage: {
    width: '100%',
    height: 300,
    marginBottom: 30,
  },
  textContainer: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginBottom: 18,
  },
  paragraph: {
    fontSize: 16,
    color: 'rgba(164, 176, 190,1.0)',
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: '600',
  },
  cardsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  cardsContainer: {
    marginTop: 30,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  infoCardDescription: {
    fontSize: 16,
    color: 'rgba(164, 176, 190,0.8)',
  },
  iconCardsSection: {
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  sectionDescription: {
    fontSize: 18,
    color: 'rgba(164, 176, 190,0.8)',
    lineHeight: 24,
    marginBottom: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  iconCardsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  iconCard: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconCardTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: 'white',
    marginBottom: 9,
    textAlign: 'center',
  },
  iconCardDescription: {
    fontSize: 16,
    color: 'rgba(164, 176, 190,0.8)',
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  packagesSection: {
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  packageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  packagePrice: {
    fontSize: 30,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  packagePeriod: {
    fontSize: 16,
    color: 'rgba(164, 176, 190,0.8)',
    marginBottom: 8,
  },
  packageTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: '#6C4EE0',
    marginTop: 8,
    marginBottom: 8,
  },
  packageDescription: {
    fontSize: 16,
    color: '#E2E2E2',
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    alignSelf: 'stretch',
    marginTop: 20,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 10,
    fontWeight: '600',
  },
  disabledFeature: {
    color: '#777',
  },
  packageSubscribeButton: {
    backgroundColor: '#333333',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginTop: 10,
    width: '100%',
  },
  packageButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default WelcomeScreen;