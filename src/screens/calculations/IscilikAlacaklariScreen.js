import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Text, Card, Divider, Button, Switch } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../../theme/colors';
import calculationService from '../../services/calculationService';

const IscilikAlacaklariScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    brutMaas: '',
    iseBaslamaTarihi: new Date(),
    istenCikisTarihi: new Date(),
    kidemTazminati: true,
    ihbarTazminati: true,
    yillikIzin: true,
    fazlaMesai: false,
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
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
    if (name === 'brutMaas') {
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

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setFormData({
        ...formData,
        iseBaslamaTarihi: selectedDate
      });
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setFormData({
        ...formData,
        istenCikisTarihi: selectedDate
      });
    }
  };

  const handleCalculate = async () => {
    if (!formData.brutMaas) {
      setError('Lütfen brüt maaş değerini giriniz');
      return;
    }

    if (formData.iseBaslamaTarihi >= formData.istenCikisTarihi) {
      setError('İşe başlama tarihi, işten çıkış tarihinden önce olmalıdır');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestData = {
        brutMaas: Number(formData.brutMaas),
        iseBaslamaTarihi: formData.iseBaslamaTarihi.toISOString().split('T')[0],
        istenCikisTarihi: formData.istenCikisTarihi.toISOString().split('T')[0],
        kidemTazminati: formData.kidemTazminati,
        ihbarTazminati: formData.ihbarTazminati,
        yillikIzin: formData.yillikIzin,
        fazlaMesai: formData.fazlaMesai,
      };

      const response = await calculationService.calculateIscilikAlacaklari(requestData);
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
        <Text style={styles.headerTitle}>İşçilik Alacakları Hesaplama</Text>
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
              
              {result.kidemTazminati !== undefined && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Kıdem Tazminatı:</Text>
                  <Text style={styles.resultValue}>
                    {new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                      minimumFractionDigits: 2
                    }).format(result.kidemTazminati)}
                  </Text>
                </View>
              )}
              
              {result.ihbarTazminati !== undefined && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>İhbar Tazminatı:</Text>
                  <Text style={styles.resultValue}>
                    {new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                      minimumFractionDigits: 2
                    }).format(result.ihbarTazminati)}
                  </Text>
                </View>
              )}
              
              {result.yillikIzin !== undefined && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Yıllık İzin Ücreti:</Text>
                  <Text style={styles.resultValue}>
                    {new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                      minimumFractionDigits: 2
                    }).format(result.yillikIzin)}
                  </Text>
                </View>
              )}
              
              {result.fazlaMesai !== undefined && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Fazla Mesai Ücreti:</Text>
                  <Text style={styles.resultValue}>
                    {new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                      minimumFractionDigits: 2
                    }).format(result.fazlaMesai)}
                  </Text>
                </View>
              )}
              
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Toplam:</Text>
                <Text style={[styles.resultValue, styles.totalValue]}>
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                    minimumFractionDigits: 2
                  }).format(result.total)}
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
              <Text style={styles.sectionTitle}>Brüt Maaş (TL)</Text>
              <TextInput
                style={styles.textInput}
                value={formatCurrency(formData.brutMaas)}
                onChangeText={(text) => handleInputChange('brutMaas', text)}
                keyboardType="numeric"
                placeholder="0,00"
                placeholderTextColor="#666"
              />
              
              <Text style={[styles.sectionTitle, {marginTop: 16}]}>İşe Başlama Tarihi</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {formatDate(formData.iseBaslamaTarihi)}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
              
              {showStartDatePicker && (
                <DateTimePicker
                  value={formData.iseBaslamaTarihi}
                  mode="date"
                  display="default"
                  onChange={handleStartDateChange}
                  maximumDate={new Date()}
                />
              )}
              
              <Text style={[styles.sectionTitle, {marginTop: 16}]}>İşten Çıkış Tarihi</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {formatDate(formData.istenCikisTarihi)}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
              
              {showEndDatePicker && (
                <DateTimePicker
                  value={formData.istenCikisTarihi}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                  minimumDate={formData.iseBaslamaTarihi}
                  maximumDate={new Date()}
                />
              )}
              
              <Text style={[styles.sectionTitle, {marginTop: 16}]}>Hesaplanacak Kalemler</Text>
              
              <View style={styles.switchItem}>
                <Text style={styles.switchLabel}>Kıdem Tazminatı</Text>
                <Switch
                  value={formData.kidemTazminati}
                  onValueChange={(value) => handleInputChange('kidemTazminati', value)}
                  color={colors.primary.main}
                />
              </View>
              
              <View style={styles.switchItem}>
                <Text style={styles.switchLabel}>İhbar Tazminatı</Text>
                <Switch
                  value={formData.ihbarTazminati}
                  onValueChange={(value) => handleInputChange('ihbarTazminati', value)}
                  color={colors.primary.main}
                />
              </View>
              
              <View style={styles.switchItem}>
                <Text style={styles.switchLabel}>Yıllık İzin</Text>
                <Switch
                  value={formData.yillikIzin}
                  onValueChange={(value) => handleInputChange('yillikIzin', value)}
                  color={colors.primary.main}
                />
              </View>
              
              <View style={styles.switchItem}>
                <Text style={styles.switchLabel}>Fazla Mesai</Text>
                <Switch
                  value={formData.fazlaMesai}
                  onValueChange={(value) => handleInputChange('fazlaMesai', value)}
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

export default IscilikAlacaklariScreen;