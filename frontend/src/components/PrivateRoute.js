// File: frontend/src/components/PrivateRoute.js
// Path: /inviter-app/frontend/src/components/PrivateRoute.js
// Description: Protected route component for authentication

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}