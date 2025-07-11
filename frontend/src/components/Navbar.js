// File: frontend/src/components/Navbar.js
// Path: /inviter-app/frontend/src/components/Navbar.js
// Description: Navigation bar component with dark mode toggle

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DarkModeToggle from './DarkModeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
      <div className="nav-container">
        <Link to="/" className="logo dark:text-indigo-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Inviter
        </Link>
        
        {user ? (
          <div className="nav-links">
            <Link to="/" className="nav-link dark:text-gray-300 dark:hover:text-indigo-400">Dashboard</Link>
            <Link to="/create" className="nav-link dark:text-gray-300 dark:hover:text-indigo-400">Create Invitation</Link>
            <DarkModeToggle />
            <div className="user-menu">
              <div className="user-avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
              <button onClick={handleLogout} className="btn btn-secondary dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="nav-links">
            <DarkModeToggle />
            <Link to="/login" className="btn btn-primary">Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
}