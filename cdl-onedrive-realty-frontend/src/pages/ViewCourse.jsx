// pages/DrivingCourses/ViewCourse.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import drivingCourseService from '../services/drivingCourse.service';

export default function ViewCourse() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      try {
        const response = await drivingCourseService.getCourseById(courseId);
        setCourse(response.data.course);
        setLessons(response.data.course.lessons || []);
      } catch (error) {
        toast.error('Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndLessons();
  }, [courseId]);

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
          {course && (
            <h1 className="text-2xl font-bold mb-8 text-center">
              {course.courseName}
            </h1>
          )}
          
          {lessons.length > 0 && (
            <h2 className="text-xl font-bold mb-6 text-center">
              Total Lessons: {lessons.length}
            </h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson, index) => (
              <div 
                key={lesson._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                {lesson.materials?.secure_url && (
                  <div className="aspect-video">
                    <video 
                      className="w-full h-full object-cover" 
                      controls
                      controlsList="nodownload"
                    >
                      <source src={lesson.materials.secure_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg">
                    Lesson {index + 1}: {lesson.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    {lesson.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {lessons.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No lessons available for this course.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
