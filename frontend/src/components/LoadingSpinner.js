// File: frontend/src/components/LoadingSpinner.js
// Path: /inviter-app/frontend/src/components/LoadingSpinner.js
// Description: Loading spinner component

import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
}