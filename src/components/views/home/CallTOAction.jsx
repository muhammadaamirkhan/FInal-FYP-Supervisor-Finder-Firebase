import React from 'react';
import { Link } from 'react-router-dom';

function CallToAction() {
  return (
    <div className="cta-section bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-700 opacity-60"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Start Your FYP Journey Today</h2>
        <p className="text-xl mb-8">
          Connect with the perfect supervisor for your Final Year Project
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/faculty"
            className="bg-white text-teal-600 font-bold py-3 px-8 rounded-lg hover:bg-teal-100 hover:scale-105 transition-all duration-300 ease-in-out text-center"
          >
            Browse Supervisors
          </Link>
          <button 
            className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300 ease-in-out"
            onClick={() => console.log('Learn more clicked')}
          >
            How It Works
          </button>
        </div>
      </div>
    </div>
  );
}

export default CallToAction;