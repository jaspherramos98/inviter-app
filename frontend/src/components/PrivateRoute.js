// File: frontend/src/components/PrivateRoute.js
// Path: /inviter-app/frontend/src/components/PrivateRoute.js
// Description: Protected route component for authentication

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Redirect to login if not authenticated
  return user ? children : <Navigate to="/login" />;
}