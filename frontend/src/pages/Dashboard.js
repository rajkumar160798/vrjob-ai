import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    applied: 0,
    seen: 0,
    rejected: 0,
    ghosted: 0
  });
  
  const [jobs, setJobs] = useState([]);
  
  useEffect(() => {
    // Fetch dashboard data
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/jobs');
        setJobs(response.data);
        
        // Calculate stats
        const newStats = {
          applied: response.data.length,
          seen: response.data.filter(job => job.status === 'seen').length,
          rejected: response.data.filter(job => job.status === 'rejected').length,
          ghosted: response.data.filter(job => job.status === 'ghosted').length
        };
        setStats(newStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  const chartData = [
    { name: 'Applied', value: stats.applied },
    { name: 'Seen', value: stats.seen },
    { name: 'Rejected', value: stats.rejected },
    { name: 'Ghosted', value: stats.ghosted }
  ];
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Applied</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.applied}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Seen</h3>
          <p className="text-3xl font-bold text-green-600">{stats.seen}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Ghosted</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.ghosted}</p>
        </div>
      </div>
      
      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Application Status</h2>
        <BarChart width={800} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>
      
      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap">{job.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    job.status === 'seen' ? 'bg-green-100 text-green-800' :
                    job.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    job.status === 'ghosted' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{job.applied_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard; 