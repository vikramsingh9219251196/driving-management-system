
import axios from "axios";

const API_URL = "https://driving-management-system.onrender.com/";

class AuthService {
  async register(credentials) {
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        credentials
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getCurrentUser() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  

  logout() {
    localStorage.removeItem("token");
  }
}

export default new AuthService();






