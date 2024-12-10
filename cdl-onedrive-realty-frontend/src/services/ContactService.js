// services/ContactService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api";

class ContactService {
  async sendContactEmail(formData) {
    try {
      const response = await axios.post(`${API_URL}/contact`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ContactService();