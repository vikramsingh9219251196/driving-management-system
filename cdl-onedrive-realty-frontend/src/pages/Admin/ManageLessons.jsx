// pages/DrivingCourses/ManageLessons.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import drivingCourseService from "../../services/drivingCourse.service";

export default function ManageLessons() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    materials: null,
  });

  useEffect(() => {
    fetchCourseAndLessons();
  }, [courseId]);

  const fetchCourseAndLessons = async () => {
    try {
      const response = await drivingCourseService.getCourseById(courseId);
      setCourse(response.data.course);
      setLessons(response.data.course.lessons || []);
    } catch (error) {
      toast.error("Failed to fetch course details");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
        try {
            await drivingCourseService.deleteCourseLesson(courseId, lessonId);
            toast.success("Lesson deleted successfully");
            fetchCourseAndLessons();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete lesson");
        }
    }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setUploading(true);

  const data = new FormData();
  data.append("title", formData.title);
  data.append("description", formData.description);
  
  if (formData.materials) {
    data.append("materials", formData.materials);
  }

  try {
    if (isEditing && selectedLesson) {
      await drivingCourseService.updateCourseLesson(
        courseId, 
        selectedLesson._id, 
        data
      );
      toast.success("Lesson updated successfully");
      resetForm();
      fetchCourseAndLessons(); 
    } else {
      await drivingCourseService.addLessonToCourse(courseId, data);
      toast.success("Lesson added successfully");
      fetchCourseAndLessons(); // Fetch the latest lessons after adding a new lesson
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to process the request";
    toast.error(errorMessage);
  } finally {
    setUploading(false);
  }
};




const resetForm = () => {
  setFormData({ title: "", description: "", materials: null });
  setIsEditing(false);
  setSelectedLesson(null);
};

const handleEdit = (lesson) => {
  setIsEditing(true);
  setSelectedLesson(lesson);
  setFormData({
    title: lesson.title,
    description: lesson.description,
    materials: null, 
  });
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
        <div className="max-w-4xl mx-auto mb-12">
          {" "}
          {/* Form container */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              {isEditing ? "Edit Lesson" : "Add New Lesson"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Lesson Title
                </label>
                <input
                  type="text"
                  placeholder="Enter lesson title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Lesson Description
                </label>
                <textarea
                  placeholder="Enter lesson description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg dark:bg-gray-700"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setFormData({ ...formData, materials: e.target.files[0] })
                  }
                  className="w-full p-3 border rounded-lg dark:bg-gray-700"
                  required={!isEditing}
                />
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="py-3 px-8 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {uploading
                    ? "Processing..."
                    : isEditing
                    ? "Update Lesson"
                    : "Add Lesson"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Lessons List Section */}
        <div className="max-w-7xl mx-auto">
          {lessons.length > 0 && (
            <h2 className="text-xl font-bold mb-6 text-center">
              Total Lessons: {lessons.length}
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson, index) => (
              <div
                key={lesson._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                {lesson.materials?.secure_url && (
                  <div className="aspect-video">
                    <video className="w-full h-full object-cover" controls>
                      <source
                        src={lesson.materials.secure_url}
                        type="video/mp4"
                      />
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

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(lesson)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson._id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {lessons.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No lessons available. Add your first lesson.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
