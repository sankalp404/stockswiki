// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!authService.getCurrentUser();

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;