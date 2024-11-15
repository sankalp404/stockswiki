// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth/';

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}register`, userData);
  return response.data;
};

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userFirstName', response.data.userFirstName);
      localStorage.setItem('userEmail', email); // Store the user's email from login

    }
    return response.data;
  } catch (error) {
    console.error('AuthService login error:', error); // Log the error details
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Login failed');
    } else {
      throw new Error('Login failed. Please try again later.');
    }
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userId');
  localStorage.removeItem('userFirstName');
};

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const tokenExpiration = JSON.parse(atob(token.split('.')[1])).exp;
  const currentTime = Math.floor(Date.now() / 1000);

  return tokenExpiration > currentTime;
};

const getCurrentUser = () => {
  return {
    email: localStorage.getItem('userEmail'), // Get the user's email
    id: localStorage.getItem('userId'), // Get the user's ID
    userFirstName: localStorage.getItem('userFirstName'), // Get the user's name
  };
};

const getToken = () => {
  return localStorage.getItem('token');
};

export default {
  register,
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  getToken
};