import React from "react";
import MainImage from "../assets/measurement.png";

const TruckMeasurementSingle = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Truck Dimensions in Focus
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-4">
            Get an in-depth understanding of truck dimensions with detailed views and essential information about vehicle specifications.
          </p>
        </div>

        {/* Main Image and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Main Image */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img
              src={MainImage}
              alt="Truck Main View"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Why Truck Dimensions Matter
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Knowing your truck's dimensions is crucial for safe and efficient operations, ensuring compliance with regulations and optimizing space usage for various tasks.
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>Improves vehicle maneuverability in tight spaces.</li>
              <li>Ensures compliance with transportation regulations.</li>
              <li>Enhances loading and unloading efficiency.</li>
              <li>Helps plan for parking and storage needs.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruckMeasurementSingle;
