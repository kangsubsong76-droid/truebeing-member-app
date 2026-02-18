import axios from 'axios';

/**
 * Aligo SMS Service
 * Note: Should ideally be used via a backend proxy to protect API keys.
 */
class AligoService {
    constructor() {
        this.apiKey = import.meta.env.VITE_ALIGO_API_KEY;
        this.userId = import.meta.env.VITE_ALIGO_USER_ID;
        this.sender = import.meta.env.VITE_ALIGO_SENDER;
        this.baseUrl = 'https://apis.aligo.in';
    }

    async sendSMS(receiver, msg, title = '') {
        const formData = new FormData();
        formData.append('key', this.apiKey);
        formData.append('user_id', this.userId);
        formData.append('sender', this.sender);
        formData.append('receiver', receiver);
        formData.append('msg', msg);
        formData.append('title', title);

        try {
            const response = await axios.post(`${this.baseUrl}/send/`, formData);
            return response.data;
        } catch (error) {
            console.error('Aligo SMS Error:', error);
            throw error;
        }
    }
}

export const aligo = new AligoService();
export const sendAligoSMS = (receiver, msg, title) => aligo.sendSMS(receiver, msg, title);
