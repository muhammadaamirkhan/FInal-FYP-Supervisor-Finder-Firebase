import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50 w-full">
      {/* Full-width colored bar */}
      <div className="w-full bg-indigo-800 h-1"></div>
      
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
          {/* Logo and Title - Now with animation */}
          <Link
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="p-1 rounded-full group-hover:bg-white/20 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100 group-hover:scale-105 transition-transform">
              FYP SUPERVISOR
            </span>
          </Link>

          {/* Desktop Navigation - Extended spacing */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link relative group px-3 py-1">
              Dashboard
              <span className="nav-underline"></span>
            </Link>
            <Link to="/Admin" className="nav-link relative group px-3 py-1">
              Admin
              <span className="nav-underline"></span>
            </Link>
            <Link to="/Faculty" className="nav-link relative group px-3 py-1">
              Faculty
              <span className="nav-underline"></span>
            </Link>
            <Link to="/Student" className="nav-link relative group px-3 py-1">
              Student
              <span className="nav-underline"></span>
            </Link>
            <Link 
              to="/Login"
              className="bg-white text-indigo-600 px-5 py-2 rounded-full font-medium hover:bg-yellow-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login
            </Link>
               
          </div>

          {/* Mobile Menu Button - More visible */}
          <div className="md:hidden">
            <button 
              className="text-white focus:outline-none p-2 rounded-full hover:bg-white/20 transition-colors relative"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45' : ''}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Full width */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} bg-gradient-to-b from-indigo-700 to-purple-700 shadow-xl w-full`}>
        <div className="px-6 pt-2 pb-6 space-y-3">
          {[
            { to: "/", text: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { to: "/Admin", text: "Admin", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
            { to: "/Faculty", text: "Faculty", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
            { to: "/student", text: "Student", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
            
          ].map((item, index) => (
            <Link 
              key={index}
              to={item.to}
              className="block px-4 py-3 rounded-lg text-lg font-medium hover:bg-white/10 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.text}
            </Link>
          ))}
          <Link 
            to="/Login" 
            className="block px-4 py-3 rounded-lg text-lg font-medium bg-white text-indigo-600 hover:bg-yellow-100 transition-colors flex items-center justify-center mt-4"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login
          </Link>
        </div>
      </div>

      {/* Custom CSS for animated underline */}
      <style jsx>{`
        .nav-link {
          position: relative;
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: #fef08a;
        }
        .nav-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #fef08a;
          transition: width 0.3s ease;
        }
        .nav-link:hover .nav-underline {
          width: 100%;
        }
      `}</style>
    </nav>
  );
};

export default NavBar;