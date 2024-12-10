import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import Layout from "../../components/Layout";
import drivingCourseService from "../../services/drivingCourse.service";
import { useNavigate } from "react-router-dom";

export default function CreateDrivingCourse() {
  const [formData, setFormData] = useState({
    courseName: "",
    description: "",
    courseType: "Beginner",
    price: "",
    vehicleType: "Manual",
    requirements: [], 
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      navigate('/login');
    }
  }, []);
  
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const courseTypes = ["Beginner", "Advanced", "Commercial", "Refresher"];
  const vehicleTypes = ["Manual", "Automatic", "Both"];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setThumbnail(files[0]);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRequirementChange = (e) => {
    const requirements = e.target.value.split(',').map(req => req.trim());
    setFormData(prev => ({
      ...prev,
      requirements
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formPayload = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'requirements') {
          formPayload.append(key, JSON.stringify(formData[key]));
        } else {
          formPayload.append(key, formData[key]);
        }
      });

      if (thumbnail) {
        formPayload.append('thumbnail', thumbnail);
      }

      const response = await drivingCourseService.createCourse(formPayload);

      toast.success("Driving course created successfully!");
      // Navigate to the courses list page
      navigate('/courses');  // Add this line
      
      // Reset form
      setFormData({
        courseName: "",
        description: "",
        courseType: "Beginner",
        price: "",
        vehicleType: "Manual",
        requirements: [],
      });
      setThumbnail(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Full error:", error);
      console.error("Response data:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
};



  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-12 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Create New Driving Course
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Type
                </label>
                <select
                  name="courseType"
                  value={formData.courseType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                  required
                >
                  {courseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                  required
                >
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Requirements (comma-separated)
              </label>
              <input
                type="text"
                name="requirements"
                value={formData.requirements.join(', ')}
                onChange={handleRequirementChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                placeholder="Valid license, Age 18+, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Thumbnail
              </label>
              <input
                type="file"
                name="thumbnail"
                onChange={handleInputChange}
                className="w-full"
                accept="image/*"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-pink-600 text-white font-medium"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin inline mr-2" />
                  <span>Creating Course...</span>
                </>
              ) : (
                "Create Course"
              )}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
