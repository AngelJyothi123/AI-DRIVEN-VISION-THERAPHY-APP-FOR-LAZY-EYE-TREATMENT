import api from '../api/axiosConfig';

export const chatService = {
    getConversation: async (otherId) => {
        const response = await api.get(`/chat/history/${otherId}`);
        return response.data;
    },
    sendMessage: async (receiverId, content) => {
        const response = await api.post('/chat/send', { receiverId, content });
        return response.data;
    }
};
