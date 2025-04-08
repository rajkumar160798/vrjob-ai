import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          VRJob AI Agent
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your automated job application assistant that handles everything from search to apply
        </p>
        <div className="space-x-4">
          <Link
            to="/profile"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
          >
            Setup Your Agent
          </Link>
          <Link
            to="/dashboard"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700"
          >
            Track Applications
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Automated Job Discovery</h3>
          <p className="text-gray-600">
            AI agent continuously scans top companies and job boards to find positions matching your criteria
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Smart Application Process</h3>
          <p className="text-gray-600">
            Automatically customizes your resume, writes cover letters, and submits applications on your behalf
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Real-time Tracking</h3>
          <p className="text-gray-600">
            Monitor application statuses, response rates, and interview invitations in your personalized dashboard
          </p>
        </div>
      </div>

      <div className="mt-16 bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="text-center">
            <div className="text-xl font-semibold mb-2">1. Setup</div>
            <p className="text-gray-600">Upload your resume and set your preferences</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold mb-2">2. Discovery</div>
            <p className="text-gray-600">AI finds matching jobs from target companies</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold mb-2">3. Apply</div>
            <p className="text-gray-600">Automated applications with customized materials</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold mb-2">4. Track</div>
            <p className="text-gray-600">Monitor results and interview invitations</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Welcome;
