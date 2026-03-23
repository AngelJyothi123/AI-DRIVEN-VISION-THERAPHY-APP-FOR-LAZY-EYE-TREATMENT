import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const RegisterDoctor = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    qualification: '',
    hospital: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.registerDoctor(formData);
      navigate('/login');
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.validationErrors) {
        const errors = Object.values(err.response.data.validationErrors).join(', ');
        setError(errors);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message === 'Network Error') {
        setError('Network Error: Make sure the backend server (localhost:8080) is running and CORS is enabled.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 mb-10">
      <div className="bg-white py-8 px-10 shadow rounded-lg sm:px-10">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">Doctor Registration</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}

          <div><label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" name="name" required className="mt-1 focus:ring-blue-500 block w-full border-gray-300 rounded-md py-2 px-3 border" value={formData.name} onChange={handleChange} /></div>

          <div><label className="block text-sm font-medium text-gray-700">Email address</label>
          <input type="email" name="email" required className="mt-1 focus:ring-blue-500 block w-full border-gray-300 rounded-md py-2 px-3 border" value={formData.email} onChange={handleChange} /></div>

          <div><label className="block text-sm font-medium text-gray-700">Phone</label>
          <input type="text" name="phone" required className="mt-1 focus:ring-blue-500 block w-full border-gray-300 rounded-md py-2 px-3 border" value={formData.phone} onChange={handleChange} /></div>

          <div><label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" name="password" required className="mt-1 focus:ring-blue-500 block w-full border-gray-300 rounded-md py-2 px-3 border" value={formData.password} onChange={handleChange} /></div>

          <div><label className="block text-sm font-medium text-gray-700">Qualification</label>
          <input type="text" name="qualification" required className="mt-1 focus:ring-blue-500 block w-full border-gray-300 rounded-md py-2 px-3 border" placeholder="e.g. MD - Ophthalmologist" value={formData.qualification} onChange={handleChange} /></div>

          <div><label className="block text-sm font-medium text-gray-700">Hospital/Clinic</label>
          <input type="text" name="hospital" required className="mt-1 focus:ring-blue-500 block w-full border-gray-300 rounded-md py-2 px-3 border" value={formData.hospital} onChange={handleChange} /></div>

          <button type="submit" disabled={loading} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          Already have an account? <Link to="/login" className="font-medium text-blue-600">Sign in</Link>
        </div>
      </div>
    </div>
  );
};
export default RegisterDoctor;
