// services/video.service.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const videoService = {
  uploadCourse: async (formData, config = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      // Changed to match backend route
      const response = await axios.post(`${API_URL}/videos/upload`, formData, {
        ...config,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          ...config.headers
        }
      });
      return response.data;
    } catch (error) {
      console.error('Upload service error:', error.response ? error.response.data : error);
      throw error;
    }
  },

  // Add method to create course without files
  createCourse: async (courseData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await axios.post(`${API_URL}/videos/create-video`, courseData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create course error:', error.response ? error.response.data : error);
      throw error;
    }
  }
};

export default videoService;
