import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/users/profile', {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // If the backend middleware redirects to /login, axios might follow it and return HTML
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
        setUser(null);
      } else if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.get('/api/auth/logout');
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
