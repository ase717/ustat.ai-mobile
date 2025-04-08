import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Text, Card, Divider, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import calculationService from '../../services/calculationService';

const MaasScreen = ({ navigation }) => {
  const [brutMaas, setBrutMaas] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const formatCurrency = (value) => {
    if (!value) return '';
    
    // Remove non-numeric characters except for the last comma
    const numericValue = value.replace(/[^0-9,]/g, '');
    
    // Split by comma to separate whole and decimal parts
    const parts = numericValue.split(',');
    const wholePart = parts[0];
    const decimalPart = parts.length > 1 ? parts[1].slice(0, 2) : '';
    
    // Format the whole part with dots as thousand separators
    let formattedWhole = '';
    for (let i = wholePart.length - 1, count = 0; i >= 0; i--, count++) {
      if (count > 0 && count % 3 === 0) {
        formattedWhole = '.' + formattedWhole;
      }
      formattedWhole = wholePart[i] + formattedWhole;
    }
    
    // Combine whole and decimal parts
    return formattedWhole + (decimalPart ? ',' + decimalPart : '');
  };

  const handleInputChange = (text) => {
    // Store the raw value for calculation
    setBrutMaas(text.replace(/\./g, '').replace(',', '.'));
  };

  const handleCalculate = async () => {
    if (!brutMaas) {
      setError('Lütfen brüt maaş değerini giriniz');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestData = {
        brutMaas: Number(brutMaas)
      };

      const response = await calculationService.calculateMaas(requestData);
      setResult(response.data);
    } catch (error) {
      console.error('Calculation failed:', error);
      setError(error.response?.data?.message || 'Hesaplama sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary.main} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Maaş Hesaplama</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={styles.loadingText}>Hesaplanıyor...</Text>
        </View>
      ) : result ? (
        <ScrollView style={styles.scrollView}>
          <Card style={styles.resultCard}>
            <Card.Content>
              <Text style={styles.resultTitle}>Hesaplama Sonucu</Text>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Brüt Maaş:</Text>
                <Text style={styles.resultValue}>
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                    minimumFractionDigits: 2
                  }).format(result.brutMaas)}
                </Text>
              </View>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Net Maaş:</Text>
                <Text style={styles.resultValue}>
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                    minimumFractionDigits: 2
                  }).format(result.netMaas)}
                </Text>
              </View>
              
              <Text style={styles.breakdownTitle}>Kesintiler</Text>
              
              {result.kesintiler && Object.entries(result.kesintiler).map(([key, value]) => (
                <View key={key} style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>{key}</Text>
                  <Text style={styles.breakdownValue}>
                    {new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                      minimumFractionDigits: 2
                    }).format(value)}
                  </Text>
                </View>
              ))}
              
              <Button 
                mode="contained" 
                onPress={handleReset}
                style={styles.button}
                color={colors.primary.main}
              >
                Yeni Hesaplama
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollView}>
          {error && (
            <Card style={[styles.card, styles.errorCard]}>
              <Card.Content>
                <Text style={styles.errorText}>{error}</Text>
              </Card.Content>
            </Card>
          )}
          
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Brüt Maaş (TL)</Text>
              <TextInput
                style={styles.textInput}
                value={formatCurrency(brutMaas)}
                onChangeText={handleInputChange}
                keyboardType="numeric"
                placeholder="0,00"
                placeholderTextColor="#666"
              />
            </Card.Content>
          </Card>
          
          <Button 
            mode="contained" 
            onPress={handleCalculate}
            style={styles.button}
            color={colors.primary.main}
          >
            Hesapla
          </Button>
        </ScrollView>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: colors.background.paper,
    elevation: 2,
  },
  errorCard: {
    backgroundColor: colors.error + '20', // 20% opacity
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorText: {
    color: colors.error,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 4,
    padding: 12,
    color: colors.text.primary,
  },
  button: {
    marginVertical: 16,
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.text.primary,
  },
  resultCard: {
    marginBottom: 16,
    backgroundColor: colors.background.paper,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  resultItem: {
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  breakdownLabel: {
    color: colors.text.primary,
    fontSize: 16,
  },
  breakdownValue: {
    color: colors.primary.main,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MaasScreen;