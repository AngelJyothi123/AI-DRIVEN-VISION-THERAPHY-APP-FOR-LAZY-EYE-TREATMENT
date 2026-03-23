import api from '../api/axiosConfig';

export const exerciseService = {
  getAll: async () => {
    const response = await api.get('/exercises');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/exercises/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/exercises', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/exercises/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/exercises/${id}`);
    return response.data;
  }
};
