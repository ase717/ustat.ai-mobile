// src/screens/calculations/VekaletUcretiScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Text, Card, Button, RadioButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import calculationService from '../../services/calculationService';
import { useNavigation } from '@react-navigation/native';

const VekaletUcretiScreen = () => {
  const navigation = useNavigation();
  const [isParaOlan, setIsParaOlan] = useState(true);
  const [davaBedeli, setDavaBedeli] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format currency for display
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
    setDavaBedeli(text.replace(/\./g, '').replace(',', '.'));
  };

  const handleCalculate = async () => {
    if (isParaOlan && !davaBedeli) {
      setError('Lütfen dava bedelini giriniz');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestData = {
        isParaOlan: isParaOlan,
        davaBedeli: isParaOlan ? Number(davaBedeli) : 0,
      };

      const response = await calculationService.calculateVekaletUcreti(requestData);
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
        <Text style={styles.headerTitle}>Vekalet Ücreti Hesaplama</Text>
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
                <Text style={styles.resultLabel}>Vekalet Ücreti:</Text>
                <Text style={styles.resultValue}>
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                    minimumFractionDigits: 2
                  }).format(result.vekaletUcreti)}
                </Text>
              </View>
              
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
              <Text style={styles.sectionTitle}>Dava Türü</Text>
              <View style={styles.radioGroup}>
                <RadioButton.Group 
                  onValueChange={value => setIsParaOlan(value === 'true')} 
                  value={isParaOlan ? 'true' : 'false'}
                >
                  <View style={styles.radioItem}>
                    <RadioButton 
                      value="true" 
                      color={colors.primary.main}
                    />
                    <Text style={styles.radioLabel}>Para Olan Davalar</Text>
                  </View>
                  <View style={styles.radioItem}>
                    <RadioButton 
                      value="false" 
                      color={colors.primary.main}
                    />
                    <Text style={styles.radioLabel}>Para Olmayan Davalar</Text>
                  </View>
                </RadioButton.Group>
              </View>
              
              {isParaOlan && (
                <>
                  <Text style={[styles.sectionTitle, {marginTop: 16}]}>Dava Bedeli (TL)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formatCurrency(davaBedeli)}
                    onChangeText={handleInputChange}
                    keyboardType="numeric"
                    placeholder="0,00"
                    placeholderTextColor="#666"
                  />
                </>
              )}
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
    marginTop: 30,
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
  radioGroup: {
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    color: colors.text.primary,
    fontSize: 16,
    marginLeft: 8,
  },
  button: {
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.text.primary,
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: colors.background.paper,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  resultLabel: {
    color: colors.text.primary,
    fontSize: 16,
  },
  resultValue: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VekaletUcretiScreen;