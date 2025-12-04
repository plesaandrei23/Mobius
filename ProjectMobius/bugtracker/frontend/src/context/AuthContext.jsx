import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, we might validate the token with the backend here
      // For now, we'll assume if a token exists, the user is logged in
      // We could decode the token to get user info if it's a JWT
      setUser({ token }); 
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      const { token, user: userData } = res.data; // Adjust based on actual backend response
      localStorage.setItem('token', token);
      setUser({ token, ...userData });
      return { success: true };
    } catch (error) {
      console.error("Login error", error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', { email, password });
      return { success: true, message: res.data.message };
    } catch (error) {
      console.error("Register error", error);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
