'use client';

import { useState } from 'react';
import { register } from '../services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Fungsi untuk kapitalisasi huruf pertama
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        
        {error && <div className="bg-red-50 p-4 rounded-md border border-red-300"><p className="text-red-700">{error}</p></div>}
        {success && <div className="bg-green-50 p-4 rounded-md border border-green-300"><p className="text-green-700">{success}</p></div>}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {['username', 'password', 'confirmPassword'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="sr-only">
                  {field === 'confirmPassword' ? 'Confirm Password' : capitalizeFirstLetter(field)}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field.includes('password') ? 'password' : 'text'}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  placeholder={
                    field === 'confirmPassword'
                      ? 'Confirm Password'
                      : capitalizeFirstLetter(field)
                  }
                  value={formData[field]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          
          <p className="text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-500">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}