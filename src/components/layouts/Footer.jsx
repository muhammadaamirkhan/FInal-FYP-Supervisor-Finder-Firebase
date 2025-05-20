import React from 'react';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-teal-600 to-blue-800 text-white py-8 mt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-900 opacity-50"></div> {/* Subtle gradient overlay */}
      <div className="container mx-auto text-center relative z-10">
        <p className="text-lg sm:text-xl font-medium mb-4 opacity-80">
          © 2025 <span className="font-semibold">FYP Supervisor Finder</span>. All rights reserved.
        </p>
        <p className="text-base sm:text-lg mb-6 opacity-80">Follow us on:</p>
        <div className="space-x-6">
          <a 
            href="https://facebook.com" 
            className="text-white hover:text-blue-200 transition-all duration-300 ease-in-out hover:scale-105 font-semibold tracking-wide"
          >
            Facebook
          </a>
          <a 
            href="https://twitter.com" 
            className="text-white hover:text-blue-200 transition-all duration-300 ease-in-out hover:scale-105 font-semibold tracking-wide"
          >
            Twitter
          </a>
          <a 
            href="https://linkedin.com" 
            className="text-white hover:text-blue-200 transition-all duration-300 ease-in-out hover:scale-105 font-semibold tracking-wide"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
