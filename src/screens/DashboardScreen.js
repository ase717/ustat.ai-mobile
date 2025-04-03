import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip, Searchbar, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import colors from '../theme/colors';

const DashboardScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  const recentQueries = [
    { id: 1, text: 'Vergi kesintisi nasıl hesaplanır?' },
    { id: 2, text: 'İş sözleşmesi feshi tazminat hakkı' },
    { id: 3, text: 'Kiracı hakları nelerdir?' }
  ];

  const savedDocuments = [
    { id: 1, title: 'Kira Sözleşmesi', date: '22 Mart 2025' },
    { id: 2, title: 'İş Sözleşmesi', date: '15 Mart 2025' }
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Text style={styles.welcomeText}>Hoş Geldiniz, {user?.name || 'Kullanıcı'}!</Text>
            <Text style={styles.welcomeSubText}>Ne öğrenmek istersiniz?</Text>
            
            <Searchbar
              placeholder="Hukuki bir soru sorun..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
              iconColor={colors.primary.main}
            />
            
            <View style={styles.chipContainer}>
              <Chip style={styles.chip} onPress={() => {}}>Vergi Hukuku</Chip>
              <Chip style={styles.chip} onPress={() => {}}>İş Hukuku</Chip>
              <Chip style={styles.chip} onPress={() => {}}>Aile Hukuku</Chip>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Son Sorular</Text>
              <Button onPress={() => {}} textColor={colors.primary.main}>Tümünü Gör</Button>
            </View>
            
            {recentQueries.map((query) => (
              <View key={query.id}>
                <View style={styles.queryItem}>
                  <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.primary.main} />
                  <Text style={styles.queryText}>{query.text}</Text>
                </View>
                <Divider style={styles.divider} />
              </View>
            ))}
          </Card.Content>
        </Card>
        
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Kaydedilen Dökümanlar</Text>
              <Button onPress={() => {}} textColor={colors.primary.main}>Tümünü Gör</Button>
            </View>
            
            {savedDocuments.map((doc) => (
              <View key={doc.id}>
                <View style={styles.documentItem}>
                  <Ionicons name="document-text-outline" size={24} color={colors.primary.main} />
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentTitle}>{doc.title}</Text>
                    <Text style={styles.documentDate}>{doc.date}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={colors.grey[500]} />
                </View>
                <Divider style={styles.divider} />
              </View>
            ))}
          </Card.Content>
        </Card>
        
        <Card style={styles.usageCard}>
          <Card.Content>
            <Text style={styles.usageTitle}>Kullanım İstatistikleri</Text>
            <View style={styles.usageRow}>
              <View style={styles.usageItem}>
                <Text style={styles.usageValue}>12</Text>
                <Text style={styles.usageLabel}>Toplam Soru</Text>
              </View>
              <View style={styles.usageItem}>
                <Text style={styles.usageValue}>5</Text>
                <Text style={styles.usageLabel}>Döküman</Text>
              </View>
              <View style={styles.usageItem}>
                <Text style={styles.usageValue}>20%</Text>
                <Text style={styles.usageLabel}>Kredi</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
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
  welcomeCard: {
    margin: 16,
    borderRadius: 8,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubText: {
    fontSize: 16,
    marginBottom: 16,
    color: colors.text.secondary,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: colors.grey[100],
    borderRadius: 8,
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  sectionCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  queryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  queryText: {
    marginLeft: 12,
    flex: 1,
  },
  divider: {
    backgroundColor: colors.grey[200],
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentTitle: {
    fontWeight: 'bold',
  },
  documentDate: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  usageCard: {
    margin: 16,
    marginTop: 0,
    marginBottom: 24,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: colors.primary.main,
  },
  usageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.common.white,
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
    color: colors.common.white,
  },
  usageLabel: {
    color: colors.common.white,
    opacity: 0.8,
  },
});

export default DashboardScreen;