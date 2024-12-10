// client/src/context/AuthContext.js
import React, { createContext, useState } from 'react';
import authService from '../services/auth.service';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshUserData();
      } catch (error) {
        console.error('Authentication initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);
 // client/src/context/AuthContext.js
 const refreshUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }
    
    const userData = await authService.getCurrentUser();
    if (userData) {
      setUser(userData); // Update user data with fresh information from server
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      setUser(null);
      toast.error('Session expired. Please login again.');
    } else {
      console.error('Error refreshing user data:', error);
      toast.error('Error loading user data');
    }
    throw error;
  }
};


const login = async (userData) => {
  try {
    setUser(userData); // Set initial user data
    
    // Refresh user data to get the latest role information
    await refreshUserData();
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};



  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    toast.info('Logged out successfully!');
  };

  return (
    <AuthContext.Provider value={{ user,setUser, login, logout, loading }}>
    {!loading && children}
  </AuthContext.Provider>
  );
};
