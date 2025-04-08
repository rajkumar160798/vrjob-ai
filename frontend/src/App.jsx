import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/welcome'; // ✅ import from the new file
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default App;
