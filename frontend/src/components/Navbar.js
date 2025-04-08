import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkClass = (path) => {
    return `px-3 py-2 rounded-md text-sm font-medium ${
      isActive(path)
        ? 'bg-indigo-900 text-white'
        : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
    }`;
  };

  return (
    <nav className="bg-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-white">VRJob AI</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className={linkClass('/')}>
                  Home
                </Link>
                <Link to="/dashboard" className={linkClass('/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/profile" className={linkClass('/profile')}>
                  Profile
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Scan Emails
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 