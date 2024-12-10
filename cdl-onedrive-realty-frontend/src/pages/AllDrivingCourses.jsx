// pages/DrivingCourses/AllDrivingCourses.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import drivingCourseService from '../services/drivingCourse.service';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext like in Navbar

export default function AllDrivingCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); 
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await drivingCourseService.getAllCourses();
      setCourses(response.data.courses);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-12 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              {isAdmin ? 'Manage Driving Courses' : 'Available Driving Courses'}
            </h1>
            {isAdmin && (
              <Link 
                to="/admin/courses/create"
                className="py-2 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Create New Course
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {course.thumbnail?.secure_url && (
                  <img
                    src={course.thumbnail.secure_url}
                    alt={course.courseName}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{course.courseName}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {course.courseType}
                    </span>
                    <span className="text-green-600 font-semibold">
                      ${course.price}
                    </span>
                  </div>

                  {isAdmin ? (
                    <div className="space-y-2">
                      {/* <Link 
                        to={`/courses/${course._id}/edit`}
                        className="block w-full text-center py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-pink-600 text-white font-medium"
                      >
                        Edit Course
                      </Link> */}
                      <Link
                        to={`/courses/${course._id}/lessons`}
                        className="block w-full text-center py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-pink-600 text-white font-medium"
    
                      >
                        Manage Lessons
                      </Link>
                     
                    </div>
                  ) : (
                    <Link 
                      to={user ? `/courses/view/${course._id}` : '/login'}
                      className="block w-full text-center py-2 px-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      {user ? 'View Course' : 'Login to View Course'}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {courses.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
              No courses available at the moment.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
