import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true); // App level loading

  useEffect(() => {
    // Ensure all requests send and receive cookies
    axios.defaults.withCredentials = true;

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      
      // In a real app, you would fetch /api/me to validate token and get full user
      // For now, we decode basic info from token or assume validity if token exists
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
    setIsLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.accessToken);
      setUser(res.data.user);
    }
    return res.data;
  };

  const register = async (userData) => {
    const res = await axios.post('/api/auth/register', userData);
    if (res.data.success) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.accessToken);
      setUser(res.data.user);
    }
    return res.data;
  };

  const loginWithGoogle = async (tokenId) => {
    const res = await axios.post('/api/auth/google', { tokenId });
    if (res.data.success) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.accessToken);
      setUser(res.data.user);
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, loginWithGoogle, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
