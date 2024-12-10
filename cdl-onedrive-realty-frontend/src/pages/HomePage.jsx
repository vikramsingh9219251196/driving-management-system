import React from "react";
import { Link } from "react-router-dom";
import heroPng from "../assets/home.png"; 
import Layout from "../components/Layout";
import TruckMeasurement from "../components/TruckMeasurement";
export default function HomePage() {
  return (
    <Layout>
      <section className="md:py-14 py-10 text-gray-900 dark:text-white flex md:flex-row flex-col-reverse items-center justify-center md:gap-12 gap-8 md:px-20 px-8 min-h-[85vh] bg-gradient-to-r from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        {/* Left Content */}
        <div className="md:w-1/2 w-full space-y-6">
          <h1 className="md:text-5xl text-4xl font-bold leading-tight text-gray-900 dark:text-gray-200">
            Manage Your 
            <span className="text-blue-600 font-extrabold"> Driving Licenses</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Simplify your driving license management process. Whether you need 
            to apply for a new license, renew your existing one, or check your application status, we've got you covered.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link to="/apply-license">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium md:px-6 px-4 md:py-3 py-2 rounded-md md:text-lg text-base transition-all ease-in-out duration-300 shadow-lg">
                Apply for a License
              </button>
            </Link>
            <Link to="/track-status">
              <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium md:px-6 px-4 md:py-3 py-2 rounded-md md:text-lg text-base transition-all ease-in-out duration-300 shadow-lg">
                Track Application Status
              </button>
            </Link>
          </div>
        </div>

        {/* Right Content (Hero Image) */}
        <div className="md:w-1/2 w-full flex items-center justify-center">
          <img 
            src={heroPng} 
            alt="Driving management system illustration" 
            className="w-full h-auto max-w-md rounded-md shadow-lg"
          />
        </div>
      </section>
      <TruckMeasurement/>
      </Layout>
  );
}
