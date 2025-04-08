import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location_preference: '',
    years_experience: 0,
    skills: [],
    desired_roles: [],
    linkedin_url: '',
    visa_sponsorship: false,
    relocation_willingness: false
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'years_experience' ? parseInt(value) || 0 : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      setNewSkill('');
    }
  };

  const addRole = () => {
    if (newRole && !formData.desired_roles.includes(newRole)) {
      setFormData(prev => ({
        ...prev,
        desired_roles: [...prev.desired_roles, newRole]
      }));
      setNewRole('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const removeRole = (role) => {
    setFormData(prev => ({
      ...prev,
      desired_roles: prev.desired_roles.filter(r => r !== role)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      alert('Please upload your resume');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('resume_file', resumeFile);
    formDataToSend.append('user_data', JSON.stringify({
      ...formData,
      years_experience: parseInt(formData.years_experience) || 0,
      location_preference: formData.location_preference
    }));

    try {
      const response = await axios.post('http://localhost:8000/users/intake', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('Error submitting profile. Please check your form data and try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Complete Your Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location Preference</label>
          <select
            name="location_preference"
            value={formData.location_preference}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a preference</option>
            <option value="remote">remote</option>
            <option value="hybrid">hybrid</option>
            <option value="onsite">onsite</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
          <input
            type="number"
            name="years_experience"
            value={formData.years_experience}
            onChange={handleInputChange}
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Skills</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter a skill"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Desired Roles</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter a role"
            />
            <button
              type="button"
              onClick={addRole}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.desired_roles.map((role, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {role}
                <button
                  type="button"
                  onClick={() => removeRole(role)}
                  className="ml-2 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">LinkedIn URL (Optional)</label>
          <input
            type="url"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Resume</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="visa_sponsorship"
              checked={formData.visa_sponsorship}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                visa_sponsorship: e.target.checked
              }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Need Visa Sponsorship
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="relocation_willingness"
              checked={formData.relocation_willingness}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                relocation_willingness: e.target.checked
              }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Willing to Relocate
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Submit Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
