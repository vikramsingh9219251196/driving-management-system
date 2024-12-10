import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  UserCircleIcon,
  MailIcon,
  ShieldCheckIcon,
  KeyIcon,
  PencilAltIcon,
  SaveIcon,
  XIcon
} from '@heroicons/react/outline';

export default function Profile() {
    const { user } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [profileData, setProfileData] = useState({
      name: '',
      email: '',
      role: '',
    });
    const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setProfileData(response.data.user);
        } catch (error) {
            toast.error('Error fetching profile data');
            console.error('Error fetching profile:', error);
        }
    };
    const handleEditClick = () => {
        setIsEditing(true);
    };
    
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                name: profileData.name,
                email: profileData.email
            };            
            await axios.put(
                'http://localhost:5000/api/auth/profile/update',
                updateData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
            setIsEditing(false);
            toast.success('Profile updated successfully!');
            fetchProfile(); 
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating profile');
            console.error('Error updating profile:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchProfile();
      }, []);
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        try {
            await axios.put(
                'http://localhost:5000/api/auth/profile/change-password',
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            setShowPasswordForm(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            toast.success('Password updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error changing password');
            console.error('Error changing password:', error);
        }
    };

    return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-lg p-8 mb-1">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-3xl text-white font-bold">
                  {profileData.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user?.role === 'admin' ? 'Admin Profile' : 'User Profile'}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
          </div>
          {/* Profile Info */}
          <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-lg p-8">
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="relative">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <UserCircleIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="relative">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MailIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="relative">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <ShieldCheckIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Role
                  </label>
                  <input
                    type="text"
                    value={profileData.role}
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      type="submit"
                      className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <SaveIcon className="h-5 w-5 mr-2" />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex items-center px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <XIcon className="h-5 w-5 mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PencilAltIcon className="h-5 w-5 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
            {/* Password Change Section */}
            <div className="mt-12 border-t pt-8">
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <KeyIcon className="h-5 w-5 mr-2" />
                {showPasswordForm ? 'Hide Password Form' : 'Change Password'}
              </button>
              {showPasswordForm && (
                <form onSubmit={handlePasswordChange} className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      <KeyIcon className="h-5 w-5 mr-2" />
                      Update Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}