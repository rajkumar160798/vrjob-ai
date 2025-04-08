import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users/1/stats');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No Profile Data Found</h2>
        <p className="mb-4">Please complete your profile to see your dashboard.</p>
        <button
          onClick={() => navigate('/profile')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Complete Profile
        </button>
        <button
  onClick={() => axios.post("http://localhost:8000/users/1/search-jobs")}
  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
>
  Auto Apply with AI
</button>

      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => navigate('/profile')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Applications</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.total_applications || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Seen</h3>
          <p className="text-3xl font-bold text-green-600">{stats.seen || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">{stats.rejected || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Interview</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.interview || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Application Success Rate</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-600">
                {stats.success_rate?.toFixed(1) || 0}%
              </p>
              <p className="text-gray-500 mt-2">of applications lead to interviews</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Matched Skills</h3>
          <div className="flex flex-wrap gap-2">
            {stats.top_skills_matched?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {stats.most_common_rejection && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Most Common Rejection Reason</h3>
          <p className="text-gray-600">{stats.most_common_rejection}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 