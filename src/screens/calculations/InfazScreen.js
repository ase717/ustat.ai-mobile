// src/screens/calculations/InfazScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import calculationService from '../../services/calculationService';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

// Same crime types as in the web version
const CrimeTypes = [
  { value: 'AdiSuclar', label: 'Adi Suçlar' },
  { value: 'KastenOldurme', label: 'Kasten Öldürme' },
  { value: 'KastenOldurmeIhmal', label: 'Kasten Öldürmenin İhmalı Davranışla İşlenmesi' },
  { value: 'KastenYaralama', label: 'Kasten Yaralama' },
  { value: 'TaksirleYaralama', label: 'Taksirle Yaralama' },
  { value: 'YuzdeSurekliDegisiklik', label: 'Yüzde Sürekli Değişikliğe Neden Olma' },
  { value: 'Iskence', label: 'İşkence' },
  { value: 'Eziyet', label: 'Eziyet' },
  { value: 'CinselSaldiri', label: 'Cinsel Saldırı' },
  { value: 'CinselSaldiri2Fikra', label: 'Cinsel Saldırı 2. Fıkra' },
  { value: 'CocuklarinCinselIstismari', label: 'Çocukların Cinsel İstismarı' },
  { value: 'ResitOlmayanlaCinselIliski', label: 'Reşit Olmayanla Cinsel İlişki' },
  { value: 'ResitOlmayanlaCinselIliski2ve3Fikra', label: 'Reşit Olmayanla Cinsel İlişki, 2. ve 3. Fıkra' },
  { value: 'CinselTaciz', label: 'Cinsel Taciz' },
  { value: 'OzelHayataKarsiSuclar', label: 'Özel Hayata ve Hayatın Gizli Alanına Karşı Suçlar' },
  { value: 'UyusturucuTicareti', label: 'Uyuşturucu veya Uyarıcı Madde İmal ve Ticareti' },
  { value: 'OrgutUyeOlma', label: 'Suç İşlemek Amacıyla Kurulan Örgüte Üye Olma' },
  { value: 'OrgutYardimEtme', label: 'Suç İşlemek Amacıyla Kurulan Örgüte Yardım Etme' },
  { value: 'DevletSirlarinaKarsiSuclar', label: 'Devlet Sırlarına Karşı Suçlar ve Casusluk' },
  { value: 'MitKanunu', label: 'Devlet istihbarat hizmetleri ve milli istihbarat teşkilatı kanunu' },
  { value: 'TerorSuclari', label: 'Terör Suçları' },
  { value: 'OrgutFaaliyetleriKapsamindaUyusturucuTicareti', label: 'Örgüt Faaliyetleri Kapsamında İşlenen Uyuşturucu Ticareti Suçu' },
  { value: 'OrgutFaaliyetleriKapsamindaDigerSuclar', label: 'Örgüt Faaliyetleri ile İşlenen ve İstisna Kanun Maddeleri Kapsamı Dışında Kalan Suçlar' },
  { value: 'OrgutFaaliyetleriKapsamindaKastenOldurmeMukerrir', label: 'Örgüt Faaliyetleri Kapsamında Kasten Öldürme Suçunun Mükerrir Olması' },
  { value: 'AdliParaCezasi', label: 'Adli Para Cezası' },
  { value: 'TayzikHapsi', label: 'Tayzik Hapsi' },
  { value: 'KisiyiHurriyettenYoksunKilma', label: 'Kişiyi Hürriyetten Yoksun Kılma' },
];

const PunishmentTypes = [
  { value: 'SURELI_HAPIS', label: 'Süreli Hapis'},
  { value: 'AGIRLASTIRILMIS_MUEBBER', label: 'Ağırlaştırılmış Müebbet'},
  { value: 'MUEBBET_HAPIS', label: 'Müebbet Hapis'},
];

export default function InfazScreen({ navigation }) {
  const [punishmentType, setPunishmentType] = useState('');
  const [crimeType, setCrimeType] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [isSick, setIsSick] = useState(false);
  const [crimeDate, setCrimeDate] = useState(new Date());
  const [showCrimeDatePicker, setShowCrimeDatePicker] = useState(false);
  const [mahsupDays, setMahsupDays] = useState('0');
  const [recurrence, setRecurrence] = useState('0');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState('0');
  const [months, setMonths] = useState('0');
  const [days, setDays] = useState('0');

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleCalculate = async () => {
    if (!punishmentType) {
      Alert.alert('Hata', 'Lütfen ceza türünü seçiniz');
      return;
    }

    if (!crimeType) {
      Alert.alert('Hata', 'Lütfen suç tipini seçiniz');
      return;
    }

    setLoading(true);

    try {
      // Find the crime type label from the array
      const selectedCrimeType = CrimeTypes.find(item => item.value === crimeType);
      
      const requestData = {
        hukumlu: {
          dogumTarihi: formatDate(birthDate),
          kadinVeCocukVarMi: hasChildren,
          hastalikRaporuVarMi: isSick
        },
        suc: {
          type: selectedCrimeType.label,
          date: formatDate(crimeDate)
        },
        ceza: {
          type: punishmentType === 'SURELI_HAPIS' ? 'Süreli Hapis' :
                punishmentType === 'MUEBBET_HAPIS' ? 'Müebbet Hapis' :
                'Ağırlaştırılmış Müebbet',
          yil: parseInt(years),
          ay: parseInt(months),
          gun: parseInt(days)
        },
        mahsup: [
          {
            type: "Gözaltı",
            startDate: formatDate(crimeDate),
            endDate: formatDate(crimeDate),
            totalDays: parseInt(mahsupDays)
          }
        ],
        tekerrur: parseInt(recurrence)
      };

      const response = await calculationService.calculateInfaz(requestData);
      setResult(response.data);
    } catch (error) {
      console.error('Calculation failed:', error);
      Alert.alert('Hata', error.response?.data?.message || 'Hesaplama sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const renderResultSection = () => {
    if (!result) return null;

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Hesaplama Sonucu</Text>
        
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Toplam Ceza Süresi:</Text>
          <Text style={styles.resultValue}>{result.toplamCezaSuresi}</Text>
        </View>
        
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Koşullu Salıverilme Tarihi:</Text>
          <Text style={styles.resultValue}>{result.kosulluSaliverilmeTarihi}</Text>
        </View>
        
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Ceza Bitiş Tarihi:</Text>
          <Text style={styles.resultValue}>{result.cezaBitisTarihi}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.newCalculationButton}
          onPress={() => setResult(null)}
        >
          <Text style={styles.newCalculationButtonText}>Yeni Hesaplama</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary.main} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>İnfaz Hesaplama</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Hesaplanıyor...</Text>
        </View>
      ) : result ? (
        renderResultSection()
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Verilen Ceza Türü</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={punishmentType}
                onValueChange={(itemValue) => setPunishmentType(itemValue)}
                style={{
                  width: '100%',
                  color: '#fff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
                dropdownIconColor="#fff"
                mode="dropdown"
              >
                <Picker.Item label="Ceza Türü Seç" value="" color="#888" />
                {PunishmentTypes.map((type) => (
                  <Picker.Item
                    key={type.value}
                    label={type.label}
                    value={type.value}
                    color="#fff"
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          {punishmentType === 'SURELI_HAPIS' && (
            <>
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Ceza Süresi</Text>
                <View style={styles.timeInputContainer}>
                  <View style={styles.timeInputGroup}>
                    <Text style={styles.timeInputLabel}>Yıl</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={years}
                      onChangeText={setYears}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.timeInputGroup}>
                    <Text style={styles.timeInputLabel}>Ay</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={months}
                      onChangeText={setMonths}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.timeInputGroup}>
                    <Text style={styles.timeInputLabel}>Gün</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={days}
                      onChangeText={setDays}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Doğum Tarihi</Text>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowBirthDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>{formatDate(birthDate)}</Text>
                </TouchableOpacity>
                
                {showBirthDatePicker && (
                  <DateTimePicker
                    value={birthDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowBirthDatePicker(false);
                      if (selectedDate) {
                        setBirthDate(selectedDate);
                      }
                    }}
                  />
                )}
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Kişi Hakkında</Text>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Çocuklu Kadın mı?</Text>
                  <Switch
                    value={hasChildren}
                    onValueChange={setHasChildren}
                    trackColor={{ false: '#333', true: '#8B5CF6' }}
                    thumbColor={hasChildren ? '#fff' : '#f4f3f4'}
                  />
                </View>
                
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Hasta mı?</Text>
                  <Switch
                    value={isSick}
                    onValueChange={setIsSick}
                    trackColor={{ false: '#333', true: '#8B5CF6' }}
                    thumbColor={isSick ? '#fff' : '#f4f3f4'}
                  />
                </View>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Suç Tipi</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={crimeType}
                    onValueChange={(itemValue) => setCrimeType(itemValue)}
                    style={styles.picker}
                    dropdownIconColor="#fff"
                    mode="dropdown"
                  >
                    <Picker.Item label="Suç Tipi Seç" value="" color="#888" />
                    {CrimeTypes.map((type) => (
                      <Picker.Item key={type.value} label={type.label} value={type.value} color="#fff" />
                    ))}
                  </Picker>
                </View>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Suç Tarihi</Text>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowCrimeDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>{formatDate(crimeDate)}</Text>
                </TouchableOpacity>
                
                {showCrimeDatePicker && (
                  <DateTimePicker
                    value={crimeDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowCrimeDatePicker(false);
                      if (selectedDate) {
                        setCrimeDate(selectedDate);
                      }
                    }}
                  />
                )}
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Mahsup Gün Sayısı</Text>
                <TextInput
                  style={styles.textInput}
                  value={mahsupDays}
                  onChangeText={setMahsupDays}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#666"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Tekerrür</Text>
                <TextInput
                  style={styles.textInput}
                  value={recurrence}
                  onChangeText={setRecurrence}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#666"
                />
              </View>
            </>
          )}
          
          <TouchableOpacity 
            style={styles.calculateButton}
            onPress={handleCalculate}
            disabled={!punishmentType}
          >
            <Text style={styles.calculateButtonText}>Hesapla</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#88909F',
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 4,
    marginTop: 8,
    backgroundColor: '#222',
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    backgroundColor: 'transparent',
    height: 50,
    width: '100%',
  },
  textInput: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    color: '#fff',
    padding: 12,
    fontSize: 16,
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeInputLabel: {
    color: '#88909F',
    marginBottom: 8,
    textAlign: 'center',
  },
  timeInput: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    color: '#fff',
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  dateButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    padding: 12,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  switchLabel: {
    color: '#fff',
    fontSize: 16,
  },
  calculateButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  resultContainer: {
    padding: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  resultItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  resultLabel: {
    color: '#88909F',
    fontSize: 14,
    marginBottom: 8,
  },
  resultValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  newCalculationButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  newCalculationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});