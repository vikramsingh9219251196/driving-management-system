// services/drivingCourse.service.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'multipart/form-data' 
});

const drivingCourseService = {
  getAllCourses: () => {
    return axios.get(`${API_URL}/driving-courses`);
  },

  getCourseById: (id) => {
    return axios.get(`${API_URL}/driving-courses/${id}`);
  },

  createCourse: (courseData) => {
    return axios.post(`${API_URL}/driving-courses`, courseData, {
      headers: getAuthHeader()
    });
  },

  addLessonToCourse: (courseId, lessonData) => {
    return axios.post(`${API_URL}/driving-courses/${courseId}/lesson`, lessonData, {
      headers: getAuthHeader()
    });
  },
  getAdminStats: () => {
    return axios.get(`${API_URL}/admin/stats/users`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });
},

  updateCourseLesson: (courseId, lessonId, lessonData) => {
    return axios.put(
        `${API_URL}/driving-courses/${courseId}/lesson/${lessonId}`, 
        lessonData, 
        {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        }
    );
},
// In services/drivingCourse.service.js
deleteCourse: (courseId) => {
  console.log('Service - Deleting Course ID:', courseId);
  return axios.delete(`${API_URL}/driving-courses/${courseId}`, {
    headers: getAuthHeader()
  });
},


updateCourse: (courseId, courseData) => {
  console.log('Updating Course - Course ID:', courseId);
  console.log('Updating Course - Course Data:', courseData);
  
  return axios.put(`${API_URL}/driving-courses/${courseId}`, courseData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data' // Important for file upload
    }
  });
},

deleteCourseLesson: (courseId, lessonId) => {
    return axios.delete(
        `${API_URL}/driving-courses/${courseId}/lesson/${lessonId}`, 
        {
            headers: getAuthHeader()
        }
    );
}
};

export default drivingCourseService;
