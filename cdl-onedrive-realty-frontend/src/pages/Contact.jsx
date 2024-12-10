import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import ContactService from "../services/ContactService";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await ContactService.sendContactEmail(formData);
      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent mb-4">
              Get in Touch
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Have questions? We're here to help. Send us a message and we'll
              respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Contact Information Cards */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <FaEnvelope className="text-blue-500 text-2xl mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Email
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    info@drivingacademy.com
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <FaPhone className="text-pink-500 text-2xl mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Phone
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="text-blue-500 text-2xl mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Location
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    123 Driving Street, City, State
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 dark:text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`className="block w-full text-center py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-pink-600 text-white font-medium" ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
