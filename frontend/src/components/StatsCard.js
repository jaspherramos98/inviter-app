// File: frontend/src/components/StatsCard.js
// Path: /inviter-app/frontend/src/components/StatsCard.js
// Description: Statistics card component for dashboard

import React from 'react';

function StatsCard({ label, value, change, trend, badge }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {badge && <span className="badge badge-active ml-2">New</span>}
      </div>
      {change && (
        <div className={`stat-change ${trend === 'up' ? 'positive' : trend === 'down' ? 'negative' : ''}`}>
          {trend === 'up' && '↑ '}
          {trend === 'down' && '↓ '}
          {change}
        </div>
      )}
    </div>
  );
}

export default StatsCard;