import React from 'react';
import { FaCar, FaUserTie, FaGraduationCap, FaAward } from 'react-icons/fa';
import Layout from '../components/Layout';
import truckSideView from '../assets/1.png'; // Replace with actual path
import truckFrontView from '../assets/4.png'; // Replace with actual path
import truckMeasurementView from '../assets/3.png'; // Replace with actual path
import truckInteriorView from '../assets/2.png'; // Replace with actual path

export default function About() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent mb-4">
              About Our Driving Academy
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              We are committed to providing top-quality driving education with a focus on safety,
              confidence, and excellence in driving skills.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <img
                src={truckSideView}
                alt="Truck Side View"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center mb-4">
                <FaCar className="text-blue-500 text-3xl mr-4" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Modern Fleet
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Our training vehicles are equipped with the latest safety features and maintained
                to the highest standards.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <img
                src={truckFrontView}
                alt="Truck Front View"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center mb-4">
                <FaUserTie className="text-pink-500 text-3xl mr-4" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Expert Instructors
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Our instructors are certified professionals with years of experience in driver education
                and road safety.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <img
                src={truckMeasurementView}
                alt="Truck Measurement View"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center mb-4">
                <FaGraduationCap className="text-blue-500 text-3xl mr-4" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Comprehensive Training
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Our curriculum combines theoretical knowledge with practical training to ensure
                complete driver education.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <img
                src={truckInteriorView}
                alt="Truck Interior View"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center mb-4">
                <FaAward className="text-pink-500 text-3xl mr-4" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Proven Success
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Our high success rate and satisfied students speak to the quality of our
                training programs.
              </p>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg mb-12">
            <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto">
              To create safe, confident, and responsible drivers through comprehensive education,
              personalized instruction, and unwavering commitment to road safety. We strive to
              exceed industry standards and prepare our students for a lifetime of safe driving.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
