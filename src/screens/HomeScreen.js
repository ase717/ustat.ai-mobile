import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import colors from '../theme/colors';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.heroTitle}>Üstat AI</Text>
        <Text style={styles.heroSubtitle}>Türkiye'nin İlk ve En Gelişmiş Hukuk Asistanı</Text>
        <Button
          mode="contained"
          style={styles.heroButton}
          onPress={() => navigation.navigate('Packages')}
        >
          Paketleri İncele
        </Button>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Özellikler</Text>
        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Hızlı Yanıtlar</Title>
              <Paragraph>Hukuki sorularınıza anında yanıt alın</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title>Doküman Analizi</Title>
              <Paragraph>Hukuki belgelerinizi analiz edin</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title>Güvenilir Kaynak</Title>
              <Paragraph>Güncel ve güvenilir hukuki kaynaklara dayalı yanıtlar</Paragraph>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* Packages Preview Section */}
      <View style={styles.packagesSection}>
        <Text style={styles.sectionTitle}>Paketlerimiz</Text>
        <View style={styles.cardContainer}>
          <Card style={styles.packageCard}>
            <Card.Content>
              <Title>Ücretsiz Paket</Title>
              <Paragraph>Temel özelliklerle başlayın</Paragraph>
              <Text style={styles.price}>0 TL</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Packages')}
              >
                İncele
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.packageCard}>
            <Card.Content>
              <Title>Pro Paket</Title>
              <Paragraph>Gelişmiş özelliklerle devam edin</Paragraph>
              <Text style={styles.price}>199 TL</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Packages')}
              >
                İncele
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.packageCard}>
            <Card.Content>
              <Title>Premium Paket</Title>
              <Paragraph>Tüm özelliklere erişin</Paragraph>
              <Text style={styles.price}>399 TL</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Packages')}
              >
                İncele
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Hemen Başlayın</Text>
        <Text style={styles.ctaSubtitle}>
          Üstat AI ile hukukun gücünü elinizde tutun
        </Text>
        <Button
          mode="contained"
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Register')}
        >
          Ücretsiz Kaydol
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  heroSection: {
    padding: 20,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.common.white,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: colors.common.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    marginTop: 20,
    backgroundColor: colors.secondary.main,
  },
  featuresSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text.primary,
  },
  cardContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  card: {
    marginBottom: 15,
    elevation: 4,
  },
  packagesSection: {
    padding: 20,
    backgroundColor: colors.grey[100],
  },
  packageCard: {
    marginBottom: 15,
    elevation: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginTop: 10,
  },
  ctaSection: {
    padding: 20,
    backgroundColor: colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.common.black,
    marginBottom: 10,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: colors.common.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    marginTop: 20,
    backgroundColor: colors.primary.dark,
  },
});

export default HomeScreen; 