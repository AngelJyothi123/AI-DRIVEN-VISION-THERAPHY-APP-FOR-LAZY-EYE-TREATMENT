import api from '../api/axiosConfig';

export const patientService = {
  getProfile: async () => {
    const response = await api.get('/patient/profile');
    return response.data;
  },
  getExercises: async () => {
    const response = await api.get('/patient/exercises');
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/patient/history');
    return response.data;
  },
  getRecommendations: async () => {
    const response = await api.get('/patient/recommendations');
    return response.data;
  },
  getAppointments: async () => {
    const response = await api.get('/patient/appointments');
    return response.data;
  },
  bookAppointment: async (data) => {
    const response = await api.post('/patient/appointments/book', data);
    return response.data;
  },
  downloadCertificate: async () => {
    const response = await api.get('/patient/reports/certificate', {
      responseType: 'blob'
    });
    return response.data;
  }
};
