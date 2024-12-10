// client/src/components/auth/Login.js
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/auth.service";
import { toast } from 'react-toastify';
import Layout from "../../components/Layout";
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await authService.login(formData);
    const userData = response.data || response;

    if (userData && userData.token) {
      localStorage.setItem('token', userData.token); // Store token first
      await login(userData.user); // Pass the user object specifically
      toast.success('Login successful!');
      navigate('/');
    } else {
      console.error('Invalid response structure:', userData);
      toast.error('Invalid response structure from server');
    }
  } catch (error) {
    console.error("Login Error Details:", {
      message: error.message,
      response: error.response,
      data: error.response?.data
    });
    
    if (error.response) {
      toast.error(error.response.data?.message || 'Server error occurred');
    } else if (error.request) {
      toast.error('No response from server');
    } else {
      toast.error(error.message || 'Login failed');
    }
  }
};

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="animate-fadeIn w-full max-w-md p-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Please sign in to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-gray-800 dark:text-white"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-gray-800 dark:text-white"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-white font-medium"
            >
              <FaSignInAlt className="h-5 w-5" />
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:underline transition-all duration-300"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="mt-8 pt-6 text-center border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-pink-500 hover:text-pink-600 font-medium hover:underline transition-all duration-300"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}





