// src/services/calculationService.js
import axios from 'axios';

const API_BASE_URL = 'https://dev.api.ustat.ai';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const calculationService = {
  // İnfaz Hesaplama (Enforcement Calculation)
  calculateInfaz: async (data) => {
    try {
      const response = await api.post('/calculations/infaz-hesaplama', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'İnfaz hesaplama işlemi başarısız oldu');
    }
  },
  
  // Vekalet Ücreti - Konusu Para Olan (Attorney Fee - Monetary Cases)
  calculateVekaletParaOlan: (amount) => {
    return api.post('/calculations/vekalet-ucreti/konusu-para-olan', { amount });
  },
  
  // Vekalet Ücreti - Konusu Para Olmayan (Attorney Fee - Non-Monetary Cases)
  calculateVekaletParaOlmayan: (court) => {
    return api.post('/calculations/vekalet-ucreti/konusu-para-olmayan', { court });
  },
  
  // Harc ve Gider (Court Fees and Expenses)
  calculateHarcGider: (data) => {
    return api.post('/calculations/dosya-masrafi', data);
  },
};

export default calculationService;