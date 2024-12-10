import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import authService from '../../services/auth.service';
import { AuthContext } from '../../context/AuthContext';
import Layout from '../../components/Layout';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // client/src/components/auth/Signup.js
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { name, email, password, confirmPassword } = formData;
    
    toast.dismiss();
  
    // Validation checks remain the same...
  
    try {
      const response = await authService.register({
        name: name.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword
      });
  
      if (response.token && response.user) {
        toast.success('Account created successfully!');
        // Store token if your auth service requires it
        localStorage.setItem('token', response.token);
        // Update auth context with user data
        await login(response.user);
        // Only navigate after everything is complete
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    }
  };
  
  
  
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="animate-fadeIn w-full max-w-md p-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Join our community today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 text-gray-800 dark:text-white"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 text-gray-800 dark:text-white"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 text-gray-800 dark:text-white"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 text-gray-800 dark:text-white"
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-pink-500 hover:bg-pink-600 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-white font-medium"
            >
              <FaUserPlus className="h-5 w-5" />
              Sign Up
            </button>
          </form>

          <div className="mt-8 pt-6 text-center border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-600 font-medium hover:underline transition-all duration-300"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
