// services/ContactService.js
import axios from "axios";

const API_URL = "https://driving-management-system.onrender.com/";

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
