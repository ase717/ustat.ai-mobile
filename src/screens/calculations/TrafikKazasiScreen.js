import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Text, Card, Button, RadioButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../../theme/colors';
import calculationService from '../../services/calculationService';

const TrafikKazasiScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    dogumTarihi: new Date(1990, 0, 1),
    kazaTarihi: new Date(),
    cinsiyet: 'erkek',
    maluliyet: '',
    gelir: '',
    kusurOrani: '',
  });
  const [showDogumDatePicker, setShowDogumDatePicker] = useState(false);
  const [showKazaDatePicker, setShowKazaDatePicker] = useState(false);
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

  const handleInputChange = (name, value) => {
    if (name === 'gelir' || name === 'maluliyet' || name === 'kusurOrani') {
      // Store the raw value for calculation
      setFormData({
        ...formData,
        [name]: value.replace(/\./g, '').replace(',', '.')
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleDogumDateChange = (event, selectedDate) => {
    setShowDogumDatePicker(false);
    if (selectedDate) {
      setFormData({
        ...formData,
        dogumTarihi: selectedDate
      });
    }
  };

  const handleKazaDateChange = (event, selectedDate) => {
    setShowKazaDatePicker(false);
    if (selectedDate) {
      setFormData({
        ...formData,
        kazaTarihi: selectedDate
      });
    }
  };

  const handleCalculate = async () => {
    if (!formData.maluliyet) {
      setError('Lütfen maluliyet oranını giriniz');
      return;
    }

    if (!formData.gelir) {
      setError('Lütfen gelir değerini giriniz');
      return;
    }

    if (!formData.kusurOrani) {
      setError('Lütfen kusur oranını giriniz');
      return;
    }

    const maluliyetValue = parseFloat(formData.maluliyet);
    if (isNaN(maluliyetValue) || maluliyetValue <= 0 || maluliyetValue > 100) {
      setError('Maluliyet oranı 0-100 arasında olmalıdır');
      return;
    }

    const kusurValue = parseFloat(formData.kusurOrani);
    if (isNaN(kusurValue) || kusurValue < 0 || kusurValue > 100) {
      setError('Kusur oranı 0-100 arasında olmalıdır');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestData = {
        dogumTarihi: formData.dogumTarihi.toISOString().split('T')[0],
        kazaTarihi: formData.kazaTarihi.toISOString().split('T')[0],
        cinsiyet: formData.cinsiyet,
        maluliyet: Number(formData.maluliyet),
        gelir: Number(formData.gelir),
        kusurOrani: Number(formData.kusurOrani)
      };

      const response = await calculationService.calculateTrafikKazasi(requestData);
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
        <Text style={styles.headerTitle}>Trafik Kazası Tazminat Hesaplama</Text>
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
                <Text style={styles.resultLabel}>Maddi Tazminat:</Text>
                <Text style={styles.resultValue}>
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                    minimumFractionDigits: 2
                  }).format(result.maddiTazminat)}
                </Text>
              </View>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Manevi Tazminat:</Text>
                <Text style={styles.resultValue}>
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                    minimumFractionDigits: 2
                  }).format(result.maneviTazminat)}
                </Text>
              </View>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Toplam Tazminat:</Text>
                <Text style={[styles.resultValue, styles.totalValue]}>
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                    minimumFractionDigits: 2
                  }).format(result.toplamTazminat)}
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
              <Text style={styles.sectionTitle}>Doğum Tarihi</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDogumDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {formatDate(formData.dogumTarihi)}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
              
              {showDogumDatePicker && (
                <DateTimePicker
                  value={formData.dogumTarihi}
                  mode="date"
                  display="default"
                  onChange={handleDogumDateChange}
                  maximumDate={new Date()}
                />
              )}
              
              <Text style={[styles.sectionTitle, {marginTop: 16}]}>Kaza Tarihi</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowKazaDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {formatDate(formData.kazaTarihi)}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
              
              {showKazaDatePicker && (
                <DateTimePicker
                  value={formData.kazaTarihi}
                  mode="date"
                  display="default"
                  onChange={handleKazaDateChange}
                  maximumDate={new Date()}
                />
              )}
              
              <Text style={[styles.sectionTitle, {marginTop: 16}]}>Cinsiyet</Text>
              <View style={styles.radioGroup}>
                <RadioButton.Group
                  onValueChange={(value) => handleInputChange('cinsiyet', value)}
                  value={formData.cinsiyet}
                >
                  <View style={styles.radioButton}>
                    <RadioButton
                      value="erkek"
                      color={colors.primary.main}
                    />
                    <Text style={styles.radioLabel}>Erkek</Text>
                  </View>
                  <View style={styles.radioButton}>
                    <RadioButton
                      value="kadın"
                      color={colors.primary.main}
                    />
                    <Text style={styles.radioLabel}>Kadın</Text>
                  </View>
                </RadioButton.Group>
              </View>
              
              <Text style={[styles.sectionTitle, {marginTop: 16}]}>Maluliyet Oranı (%)</Text>
              <TextInput
                style={styles.textInput}
                value={formData.maluliyet}
                onChangeText={(text) => handleInputChange('maluliyet', text)}
                keyboardType="numeric"
                placeholder="Örn: 25"
                placeholderTextColor="#666"
              />
              
              <Text style={[styles.sectionTitle, {marginTop: 16}]}>Kusur Oranı (%)</Text>
              <TextInput
                style={styles.textInput}
                value={formData.kusurOrani}
                onChangeText={(text) => handleInputChange('kusurOrani', text)}
                keyboardType="numeric"
                placeholder="Örn: 30"
                placeholderTextColor="#666"
              />
              
              <Text style={[styles.sectionTitle, {marginTop: 16}]}>Aylık Gelir (TL)</Text>
              <TextInput
                style={styles.textInput}
                value={formatCurrency(formData.gelir)}
                onChangeText={(text) => handleInputChange('gelir', text)}
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
  dateInput: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 4,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: colors.text.primary,
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    color: colors.text.primary,
    marginLeft: 8,
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
  totalValue: {
    color: colors.primary.main,
    fontSize: 20,
  },
});

export default TrafikKazasiScreen;