import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-800 mb-6">Welcome to Project Management Tool</h1>
        <p className="text-gray-600 mb-8">Manage your projects and tasks efficiently.</p>
        <div>
          <Link to="/login">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-indigo-700">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
