import api from '../api/axiosConfig';

export const sessionService = {
  startSession: async (data) => {
    const response = await api.post('/patient/start-session', data);
    return response.data;
  },
  endSession: async (data) => {
    const response = await api.post('/patient/end-session', data);
    return response.data;
  }
};
