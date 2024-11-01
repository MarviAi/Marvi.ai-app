import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  sendMessage: async (message: string) => {
    try {
      const { data } = await api.post('/chat', { message });
      return data.response;
    } catch (error) {
      console.error('Chat API error:', error);
      throw new Error('Failed to send message');
    }
  }
};

export const emailService = {
  addToWaitlist: async (firstName: string, lastName: string, email: string, message?: string) => {
    try {
      const { data } = await api.post('/waitlist', { firstName, lastName, email, message });
      return data.success;
    } catch (error) {
      console.error('Waitlist API error:', error);
      return false;
    }
  }
};