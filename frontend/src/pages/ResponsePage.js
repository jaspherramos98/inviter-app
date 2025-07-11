// File: frontend/src/pages/ResponsePage.js
// Path: /inviter-app/frontend/src/pages/ResponsePage.js
// Description: Public page for recipients to respond to invitations (no auth required)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircleIcon, XCircleIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

function ResponsePage() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invitation, setInvitation] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [hasResponded, setHasResponded] = useState(false);
  const [previousAnswer, setPreviousAnswer] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [responseSubmitted, setResponseSubmitted] = useState(false);

  useEffect(() => {
    fetchInvitationDetails();
  }, [linkId]);

  const fetchInvitationDetails = async () => {
    try {
      setLoading(true);
      // No auth header needed for public endpoint
      const response = await api.get(`/respond/${linkId}`, {
        headers: {} // Override default auth headers
      });
      
      setInvitation(response.data.invitation);
      setRecipientName(response.data.recipient_name);
      setHasResponded(response.data.has_responded);
      setPreviousAnswer(response.data.previous_answer);
    } catch (error) {
      if (error.response?.status === 404) {
        setError('Invalid invitation link');
      } else if (error.response?.data?.detail?.includes('expired')) {
        setError('This invitation has expired');
      } else {
        setError('Unable to load invitation');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (answer) => {
    try {
      setSubmitting(true);
      await api.post(
        `/respond/${linkId}`,
        { answer, message: message.trim() || null },
        { headers: {} } // Override default auth headers
      );
      
      setResponseSubmitted(true);
      setHasResponded(true);
      setPreviousAnswer(answer);
    } catch (error) {
      if (error.response?.data?.status === 'already_responded') {
        setHasResponded(true);
        setPreviousAnswer(error.response.data.previous_answer);
      } else {
        setError('Failed to submit response. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="response-page-loading">
        <LoadingSpinner />
        <p>Loading invitation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="response-page error-state">
        <div className="error-container">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (responseSubmitted) {
    return (
      <div className="response-page success-state">
        <div className="success-container">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-4">Your response has been recorded.</p>
          <p className="text-sm text-gray-500">
            You answered: <strong>{previousAnswer === 'yes' ? invitation.yes_text : invitation.no_text}</strong>
          </p>
          {message && (
            <p className="text-sm text-gray-500 mt-2">
              Your message was sent to {invitation.creator_name}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="response-page">
      <div className="response-container">
        {/* Logo/Header */}
        <div className="response-header">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Inviter</span>
          </div>
        </div>

        {/* Invitation Card */}
        <div className="invitation-card">
          <div className="invitation-content">
            <p className="greeting">Hi {recipientName}!</p>
            <h1 className="invitation-title">{invitation.title}</h1>
            <p className="invitation-creator">
              From: <strong>{invitation.creator_name}</strong>
            </p>
            
            {invitation.description && (
              <p className="invitation-description">{invitation.description}</p>
            )}

            <div className="invitation-details">
              {invitation.event_date && (
                <div className="detail-item">
                  <CalendarIcon className="w-5 h-5" />
                  <span>{new Date(invitation.event_date).toLocaleString()}</span>
                </div>
              )}
              {invitation.location && (
                <div className="detail-item">
                  <MapPinIcon className="w-5 h-5" />
                  <span>{invitation.location}</span>
                </div>
              )}
            </div>
          </div>

          {hasResponded && !responseSubmitted ? (
            <div className="already-responded">
              <p className="text-lg font-semibold mb-2">You've already responded</p>
              <p className="text-gray-600">
                Your answer: <strong>{previousAnswer === 'yes' ? invitation.yes_text : invitation.no_text}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-4">
                If you need to change your response, please contact {invitation.creator_name}
              </p>
            </div>
          ) : (
            <>
              {/* Response Buttons */}
              <div className="response-section">
                <p className="response-prompt">Do you accept the invitation?</p>
                <div className="response-buttons">
                  <button
                    className="response-btn response-yes"
                    onClick={() => handleResponse('yes')}
                    disabled={submitting}
                  >
                    <CheckCircleIcon className="w-6 h-6" />
                    {invitation.yes_text}
                  </button>
                  <button
                    className="response-btn response-no"
                    onClick={() => handleResponse('no')}
                    disabled={submitting}
                  >
                    <XCircleIcon className="w-6 h-6" />
                    {invitation.no_text}
                  </button>
                </div>
              </div>

              {/* Optional Message */}
              <div className="message-section">
                <label htmlFor="message" className="message-label">
                  Add a message (optional)
                </label>
                <textarea
                  id="message"
                  className="message-input"
                  placeholder="Let them know if you have any questions or comments..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  rows={3}
                />
                <p className="character-count">
                  {message.length}/500 characters
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="response-footer">
          <p className="powered-by">
            Powered by <a href="/" target="_blank" rel="noopener noreferrer">Inviter</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .response-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .response-page-loading,
        .error-state,
        .success-state {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .error-container,
        .success-container {
          background: white;
          padding: 3rem;
          border-radius: 1rem;
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .response-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        .response-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .logo svg {
          stroke: white;
        }

        .invitation-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .invitation-content {
          padding: 2rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .greeting {
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .invitation-title {
          font-size: 1.875rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .invitation-creator {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        .invitation-description {
          color: #374151;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .invitation-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #6b7280;
        }

        .detail-item svg {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }

        .response-section {
          padding: 2rem;
          background: #f9fafb;
        }

        .response-prompt {
          text-align: center;
          font-size: 1.125rem;
          color: #374151;
          margin-bottom: 1.5rem;
        }

        .response-buttons {
          display: flex;
          gap: 1rem;
        }

        .response-btn {
          flex: 1;
          padding: 1rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .response-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .response-yes {
          background: #10b981;
          color: white;
        }

        .response-yes:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
        }

        .response-no {
          background: #ef4444;
          color: white;
        }

        .response-no:hover:not(:disabled) {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3);
        }

        .message-section {
          padding: 0 2rem 2rem;
          background: #f9fafb;
        }

        .message-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .message-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          resize: vertical;
          transition: border-color 0.3s;
        }

        .message-input:focus {
          outline: none;
          border-color: #6366f1;
        }

        .character-count {
          font-size: 0.75rem;
          color: #9ca3af;
          text-align: right;
          margin-top: 0.25rem;
        }

        .already-responded {
          padding: 2rem;
          text-align: center;
          background: #f9fafb;
        }

        .response-footer {
          text-align: center;
          margin-top: 2rem;
        }

        .powered-by {
          color: white;
          font-size: 0.875rem;
        }

        .powered-by a {
          color: white;
          font-weight: 600;
          text-decoration: none;
        }

        .powered-by a:hover {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .invitation-card {
            margin: 0 -1rem;
          }

          .invitation-content,
          .response-section,
          .message-section {
            padding: 1.5rem;
          }

          .response-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default ResponsePage;