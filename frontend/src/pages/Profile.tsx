import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface UserData {
  full_name: string;
  email: string;
  phone?: string;
  location_preference: 'remote' | 'hybrid' | 'onsite';
  years_experience: number;
  skills: string[];
  desired_roles: string[];
  linkedin_url?: string;
  salary_expectation?: number;
  preferred_industries?: string[];
  work_arrangements?: string[];
  visa_sponsorship?: boolean;
  relocation_willingness?: boolean;
}

interface UserStats {
  total_applications: number;
  seen: number;
  rejected: number;
  ghosted: number;
  interview: number;
  resume_versions: number;
  most_common_rejection?: string;
  average_response_time?: number;
  success_rate?: number;
  top_skills_matched?: string[];
  preferred_roles_matched?: string[];
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    full_name: '',
    email: '',
    phone: '',
    location_preference: 'remote',
    years_experience: 0,
    skills: [],
    desired_roles: [],
    linkedin_url: '',
    salary_expectation: 0,
    preferred_industries: [],
    work_arrangements: [],
    visa_sponsorship: false,
    relocation_willingness: false
  });
  const [stats, setStats] = useState<UserStats | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [currentIndustry, setCurrentIndustry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });
    
    if (resumeFile) {
      formData.append('resume_file', resumeFile);
    }

    try {
      const response = await axios.post('http://localhost:8000/users/intake', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Start job search process
      await axios.post(`http://localhost:8000/users/${response.data.id}/search-jobs`);
      
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to submit profile. Please try again.');
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (currentSkill && !userData.skills.includes(currentSkill)) {
      setUserData({
        ...userData,
        skills: [...userData.skills, currentSkill]
      });
      setCurrentSkill('');
    }
  };

  const addRole = () => {
    if (currentRole && !userData.desired_roles.includes(currentRole)) {
      setUserData({
        ...userData,
        desired_roles: [...userData.desired_roles, currentRole]
      });
      setCurrentRole('');
    }
  };

  const addIndustry = () => {
    if (currentIndustry && !userData.preferred_industries?.includes(currentIndustry)) {
      setUserData({
        ...userData,
        preferred_industries: [...(userData.preferred_industries || []), currentIndustry]
      });
      setCurrentIndustry('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Profile Setup</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={userData.full_name}
              onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
            <input
              type="tel"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location Preference</label>
            <select
              value={userData.location_preference}
              onChange={(e) => setUserData({ ...userData, location_preference: e.target.value as any })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <input
              type="number"
              value={userData.years_experience}
              onChange={(e) => setUserData({ ...userData, years_experience: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Salary Expectation (USD)</label>
            <input
              type="number"
              value={userData.salary_expectation}
              onChange={(e) => setUserData({ ...userData, salary_expectation: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Skills</label>
          <div className="flex mt-1">
            <input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add a skill"
            />
            <button
              type="button"
              onClick={addSkill}
              className="ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {userData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => {
                    setUserData({
                      ...userData,
                      skills: userData.skills.filter((_, i) => i !== index)
                    });
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Desired Roles</label>
          <div className="flex mt-1">
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add a role"
            />
            <button
              type="button"
              onClick={addRole}
              className="ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {userData.desired_roles.map((role, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
              >
                {role}
                <button
                  type="button"
                  onClick={() => {
                    setUserData({
                      ...userData,
                      desired_roles: userData.desired_roles.filter((_, i) => i !== index)
                    });
                  }}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Industries</label>
          <div className="flex mt-1">
            <input
              type="text"
              value={currentIndustry}
              onChange={(e) => setCurrentIndustry(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add an industry"
            />
            <button
              type="button"
              onClick={addIndustry}
              className="ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {userData.preferred_industries?.map((industry, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
              >
                {industry}
                <button
                  type="button"
                  onClick={() => {
                    setUserData({
                      ...userData,
                      preferred_industries: userData.preferred_industries?.filter((_, i) => i !== index)
                    });
                  }}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Work Arrangements</label>
            <div className="mt-2 space-y-2">
              {['Full-time', 'Part-time', 'Contract', 'Freelance'].map((arrangement) => (
                <label key={arrangement} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={userData.work_arrangements?.includes(arrangement)}
                    onChange={(e) => {
                      const newArrangements = e.target.checked
                        ? [...(userData.work_arrangements || []), arrangement]
                        : userData.work_arrangements?.filter(a => a !== arrangement);
                      setUserData({ ...userData, work_arrangements: newArrangements });
                    }}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2">{arrangement}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Preferences</label>
            <div className="mt-2 space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={userData.visa_sponsorship}
                  onChange={(e) => setUserData({ ...userData, visa_sponsorship: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2">Require Visa Sponsorship</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={userData.relocation_willingness}
                  onChange={(e) => setUserData({ ...userData, relocation_willingness: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2">Willing to Relocate</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">LinkedIn URL (Optional)</label>
          <input
            type="url"
            value={userData.linkedin_url}
            onChange={(e) => setUserData({ ...userData, linkedin_url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Resume (PDF or DOCX)</label>
          <input
            type="file"
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full"
            accept=".pdf,.doc,.docx"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Complete Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile; 