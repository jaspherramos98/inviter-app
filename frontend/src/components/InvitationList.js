// File: frontend/src/components/InvitationList.js
// Path: /inviter-app/frontend/src/components/InvitationList.js
// Description: Component for displaying list of invitations with stats

import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

function InvitationList({ invitations, onRefresh }) {
  const getStatusBadge = (invitation) => {
    const now = new Date();
    const expiresAt = invitation.expires_at ? new Date(invitation.expires_at) : null;
    
    if (!expiresAt || expiresAt > now) {
      return <span className="badge badge-active">Active</span>;
    }
    return <span className="badge badge-completed">Completed</span>;
  };

  const getResponseRate = (invitation) => {
    const total = invitation.total_sent || 0;
    const responded = (invitation.total_yes || 0) + (invitation.total_no || 0);
    return total > 0 ? Math.round((responded / total) * 100) : 0;
  };

  if (invitations.length === 0) {
    return (
      <div className="empty-state">
        <h3>No invitations yet</h3>
        <p>Create your first invitation to get started</p>
        <Link to="/create" className="btn btn-primary">
          Create Invitation
        </Link>
      </div>
    );
  }

  return (
    <div className="invitation-list">
      {invitations.map((invitation) => {
        const responseRate = getResponseRate(invitation);
        const yesPercentage = invitation.total_sent > 0 
          ? (invitation.total_yes / invitation.total_sent) * 100 
          : 0;
        const noPercentage = invitation.total_sent > 0 
          ? (invitation.total_no / invitation.total_sent) * 100 
          : 0;

        return (
          <Link
            to={`/invitation/${invitation.id}`}
            key={invitation.id}
            className="invitation-item"
          >
            <div className="invitation-header">
              <div>
                <h3 className="invitation-title">{invitation.title}</h3>
                <p className="invitation-date">
                  Created {formatDistanceToNow(new Date(invitation.created_at))} ago
                  {invitation.event_date && (
                    <> • Event on {new Date(invitation.event_date).toLocaleDateString()}</>
                  )}
                </p>
              </div>
              {getStatusBadge(invitation)}
            </div>

            <div className="invitation-stats">
              <div className="stat-item">
                <span className="stat-label">Sent To</span>
                <span className="stat-value">{invitation.total_sent}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Responded</span>
                <span className="stat-value">
                  {(invitation.total_yes || 0) + (invitation.total_no || 0)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Accepted</span>
                <span className="stat-value">{invitation.total_yes}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Declined</span>
                <span className="stat-value">{invitation.total_no}</span>
              </div>
              {invitation.total_messages > 0 && (
                <div className="message-indicator">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  {invitation.total_messages} messages
                </div>
              )}
            </div>

            <div className="response-progress">
              <div className="progress-header">
                <span>Response Progress</span>
                <span>{responseRate}% Complete</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-segment progress-yes"
                  style={{ width: `${yesPercentage}%` }}
                />
                <div
                  className="progress-segment progress-no"
                  style={{ width: `${noPercentage}%` }}
                />
                <div
                  className="progress-segment progress-pending"
                  style={{ width: `${100 - yesPercentage - noPercentage}%` }}
                />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default InvitationList;