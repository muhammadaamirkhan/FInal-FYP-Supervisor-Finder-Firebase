import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="hero-section bg-gradient-to-r from-teal-200 via-white to-green-200 py-16 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-teal-900 mb-4">
          Find Your Perfect FYP Supervisor
        </h1>
        <p className="text-lg text-gray-800 mb-6">
          Match with experienced supervisors based on your research goals and availability.
        </p>

        <Link 
          to="/Faculty" 
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
        >
          Browse Supervisors
        </Link>

        {/* Stats Preview */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm">
          {[
            { value: '', label: 'Research Domains' },
            { value: '', label: 'Available Supervisors' },
            { value: '24/7', label: 'Access' },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-80 px-5 py-2 rounded-full shadow-sm transition-transform duration-300 transform hover:scale-105 hover:shadow-md cursor-default"
            >
              <span className="font-semibold text-teal-700">{item.value}</span>{' '}
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;