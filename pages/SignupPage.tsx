import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    facility: '',
    country: '',
    city: '',
  });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (signup(formData)) {
      navigate('/');
    } else {
      setError('Could not create account. The email might already be in use.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-gray py-12">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <Stethoscope className="h-12 w-12 text-brand-blue" />
          <h2 className="mt-4 text-2xl font-bold text-center text-gray-800">Create an Observer Account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Full Name (Observer)" className="input-field" />
            <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="Email address" className="input-field" />
            <input name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="Password" className="input-field" />
            <input name="facility" type="text" required value={formData.facility} onChange={handleChange} placeholder="Facility" className="input-field" />
            <input name="country" type="text" required value={formData.country} onChange={handleChange} placeholder="Country" className="input-field" />
            <input name="city" type="text" required value={formData.city} onChange={handleChange} placeholder="City" className="input-field" />
          </div>
           <style>{`.input-field { appearance: none; position: relative; display: block; width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; color: #111827; placeholder-color: #6B7280; focus:outline-none; focus:ring-brand-blue; focus:border-brand-blue; sm:text-sm; border-radius: 0.375rem; }`}</style>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
              Create Account
            </button>
          </div>
        </form>
         <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-blue hover:text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
