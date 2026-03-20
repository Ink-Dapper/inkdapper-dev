import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 text-center">
      <h1 className="text-5xl font-bold text-gray-700 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6">Sorry, the page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">Go to Home</Link>
    </div>
  );
};

export default NotFound; 