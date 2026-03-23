import api from '../api/axiosConfig';

export const doctorService = {
  getProfile: async () => {
    const response = await api.get('/doctor/profile');
    return response.data;
  },
  getPatients: async () => {
    const response = await api.get('/doctor/patients');
    return response.data;
  },
  recommendExercise: async (data) => {
    const response = await api.post('/doctor/recommend', data);
    return response.data;
  },
  getRecommendations: async () => {
    const response = await api.get('/doctor/recommendations');
    return response.data;
  },
  getPatientProgress: async (patientId) => {
    const response = await api.get(`/doctor/patient/${patientId}/progress`);
    return response.data;
  },
  getAppointments: async () => {
    const response = await api.get('/doctor/appointments');
    return response.data;
  },
  updateAppointmentStatus: async (id, status) => {
    const response = await api.put(`/doctor/appointments/${id}/status`, { status });
    return response.data;
  }
};
