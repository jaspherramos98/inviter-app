// File: frontend/src/contexts/NotificationContext.js
// Path: /inviter-app/frontend/src/contexts/NotificationContext.js
// Description: Notification context with proper hook implementation

import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

// Export the useNotification hook that components are trying to use
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      showNotification,
      removeNotification 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}