import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

const getApiErrorMessage = (error, fallbackMessage) => {
  const data = error.response?.data;

  if (typeof data?.message === 'string') return data.message;
  if (typeof data === 'string' && data.trim()) return data;
  if (error.code === 'ERR_NETWORK') {
    return 'Unable to reach the server. Please try again later.';
  }

  return fallbackMessage;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { user: userData } = response.data;
      setUser(userData);
      return userData;
    } catch (error) {
      throw getApiErrorMessage(error, 'Invalid credentials');
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      });
      if (response.data.user) {
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw getApiErrorMessage(error, 'Unable to process request');
    }
  };

  const logout = () => {
    axios.post('/api/auth/logout').catch(() => {});
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
