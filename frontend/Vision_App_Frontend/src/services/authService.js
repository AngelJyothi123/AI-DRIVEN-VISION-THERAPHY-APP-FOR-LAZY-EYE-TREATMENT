import api from '../api/axiosConfig';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  registerDoctor: async (data) => {
    const response = await api.post('/auth/register/doctor', data);
    return response.data;
  },
  registerPatient: async (data) => {
    const response = await api.post('/auth/register/patient', data);
    return response.data;
  }
};
