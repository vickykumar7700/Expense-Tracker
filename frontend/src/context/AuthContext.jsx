import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from session storage
  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const token = sessionStorage.getItem('token');
    
    if (userInfo && token) {
      setUser(userInfo);
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.baseURL = API_URL;
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    sessionStorage.setItem('userInfo', JSON.stringify(userData));
    sessionStorage.setItem('token', token);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('token');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (userData) => {
    sessionStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
