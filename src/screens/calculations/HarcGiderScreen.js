// src/screens/calculations/HarcGiderScreen.js
import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Switch
} from 'react-native';
import { Text, Card, Divider, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import colors from '../../theme/colors';
import calculationService from '../../services/calculationService';
import { useNavigation } from '@react-navigation/native';

// Mock data for court types - same as web version
const MahkemeTurleri = [
  { value: '1', label: 'Asliye Hukuk Mahkemesi' },
  { value: '2', label: 'Asliye Ceza Mahkemesi' },
  { value: '3', label: 'Ağır Ceza Mahkemesi' },
  { value: '4', label: 'İş Mahkemesi' },
  { value: '5', label: 'Aile Mahkemesi' }
];

const HarcGiderScreen = () => {
  const navigation = useNavigation();
  
  // Form state - matching web version
  const [davaDegeri, setDavaDegeri] = useState('');
  const [tanikSayisi, setTanikSayisi] = useState('0');
  const [tarafSayisi, setTarafSayisi] = useState('2');
  const [bilirkisiSayisi, setBilirkisiSayisi] = useState('0');
  const [avukatSayisi, setAvukatSayisi] = useState('1');
  const [mahkemeTuru, setMahkemeTuru] = useState('');
  
  // Options state - matching web version
  const [options, setOptions] = useState({
    tanik: false,
    kesif: false,
    bilirkisi: false,
    maktu: true
  });
  
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
    setDavaDegeri(text.replace(/\./g, '').replace(',', '.'));
  };

  const handleOptionChange = (option) => {
    setOptions({
      ...options,
      [option]: !options[option]
    });
    
    // Reset related counts when toggling options
    if (option === 'tanik' && !options.tanik) {
      setTanikSayisi('0');
    }
    if (option === 'bilirkisi' && !options.bilirkisi) {
      setBilirkisiSayisi('0');
    }
  };

  const handleCalculate = async () => {
    if (!davaDegeri) {
      setError('Lütfen dava değerini giriniz');
      return;
    }

    if (options.tanik && (!tanikSayisi || parseInt(tanikSayisi) <= 0)) {
      setError('Lütfen tanık sayısını giriniz');
      return;
    }

    if (options.bilirkisi && (!bilirkisiSayisi || parseInt(bilirkisiSayisi) <= 0)) {
      setError('Lütfen bilirkişi sayısını giriniz');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestData = {
        davaValue: Number(davaDegeri),
        mahkemeTuru: mahkemeTuru ? mahkemeTuru : '1',
        tanikSayisi: options.tanik ? Number(tanikSayisi) : 0,
        tarafSayisi: Number(tarafSayisi),
        bilirkisiSayisi: options.bilirkisi ? Number(bilirkisiSayisi) : 0,
        avukatSayisi: Number(avukatSayisi),
        kesif: options.kesif,
        maktu: options.maktu
      };

      const response = await calculationService.calculateHarcGider(requestData);
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
        <Text style={styles.headerTitle}>Harç ve Gider Hesaplama</Text>
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
                <Text style={styles.resultLabel}>Toplam:</Text>
                <Text style={styles.resultValue}>
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                    minimumFractionDigits: 2
                  }).format(result.total)}
                </Text>
              </View>
              
              <Text style={styles.breakdownTitle}>Detaylar</Text>
              
              {result.breakdown && result.breakdown.map((item, index) => (
                <View key={index} style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>{item.description}</Text>
                  <Text style={styles.breakdownValue}>
                    {new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                      minimumFractionDigits: 2
                    }).format(item.amount)}
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
              <Text style={styles.sectionTitle}>Dava Değeri (TL)</Text>
              <TextInput
                style={styles.textInput}
                value={formatCurrency(davaDegeri)}
                onChangeText={handleInputChange}
                keyboardType="numeric"
                placeholder="0,00"
                placeholderTextColor="#666"
              />
              
              <Text style={[styles.sectionTitle, {marginTop: 16}]}>Mahkeme Türü</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={mahkemeTuru}
                  onValueChange={(itemValue) => {
                    console.log('Selected court type:', itemValue);
                    setMahkemeTuru(itemValue);
                  }}
                  style={{
                    width: '100%',
                    height: 50,
                    color: '#fff',
                  }}
                  dropdownIconColor="#fff"
                  mode="dropdown"
                >
                  <Picker.Item label="Mahkeme Türü Seç" value="" />
                  {MahkemeTurleri.map((type) => (
                    <Picker.Item 
                      key={type.value} 
                      label={type.label} 
                      value={type.value} 
                    />
                  ))}
                </Picker>
              </View>
              
              <Text style={[styles.sectionTitle, {marginTop: 16}]}>Taraf Sayısı</Text>
              <TextInput
                style={styles.textInput}
                value={tarafSayisi}
                onChangeText={setTarafSayisi}
                keyboardType="numeric"
                placeholder="2"
                placeholderTextColor="#666"
              />
              
              <Text style={[styles.sectionTitle, {marginTop: 16}]}>Avukat Sayısı</Text>
              <TextInput
                style={styles.textInput}
                value={avukatSayisi}
                onChangeText={setAvukatSayisi}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor="#666"
              />
              
              <Text style={[styles.sectionTitle, {marginTop: 16}]}>Ek Seçenekler</Text>
              
              <View style={styles.switchItem}>
                <Text style={styles.switchLabel}>Tanık Var mı?</Text>
                <Switch
                  value={options.tanik}
                  onValueChange={() => handleOptionChange('tanik')}
                  color={colors.primary.main}
                />
              </View>
              
              {options.tanik && (
                <View style={styles.indentedInput}>
                  <Text style={styles.indentedLabel}>Tanık Sayısı</Text>
                  <TextInput
                    style={styles.textInput}
                    value={tanikSayisi}
                    onChangeText={setTanikSayisi}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#666"
                  />
                </View>
              )}
              
              <View style={styles.switchItem}>
                <Text style={styles.switchLabel}>Keşif Var mı?</Text>
                <Switch
                  value={options.kesif}
                  onValueChange={() => handleOptionChange('kesif')}
                  color={colors.primary.main}
                />
              </View>
              
              <View style={styles.switchItem}>
                <Text style={styles.switchLabel}>Bilirkişi Var mı?</Text>
                <Switch
                  value={options.bilirkisi}
                  onValueChange={() => handleOptionChange('bilirkisi')}
                  color={colors.primary.main}
                />
              </View>
              
              {options.bilirkisi && (
                <View style={styles.indentedInput}>
                  <Text style={styles.indentedLabel}>Bilirkişi Sayısı</Text>
                  <TextInput
                    style={styles.textInput}
                    value={bilirkisiSayisi}
                    onChangeText={setBilirkisiSayisi}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#666"
                  />
                </View>
              )}
              
              <View style={styles.switchItem}>
                <Text style={styles.switchLabel}>Maktu Harç mı?</Text>
                <Switch
                  value={options.maktu}
                  onValueChange={() => handleOptionChange('maktu')}
                  color={colors.primary.main}
                />
              </View>
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
    marginTop: 5,
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
  pickerContainer: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  switchLabel: {
    color: colors.text.primary,
    fontSize: 16,
  },
  indentedInput: {
    marginLeft: 20,
    marginBottom: 16,
  },
  indentedLabel: {
    color: colors.text.secondary,
    fontSize: 14,
    marginBottom: 8,
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

export default HarcGiderScreen;