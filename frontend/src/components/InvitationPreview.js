// File: frontend/src/components/InvitationPreview.js
// Path: /inviter-app/frontend/src/components/InvitationPreview.js
// Description: Live preview component showing how the invitation will appear to recipients

import React from 'react';
import { CalendarIcon, MapPinIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

function InvitationPreview({ invitation }) {
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="invitation-preview-container">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h3>
      
      {/* Phone Frame */}
      <div className="phone-frame">
        <div className="phone-screen">
          {/* SMS Preview */}
          <div className="sms-preview">
            <div className="sms-bubble">
              <p className="text-sm">
                Hi! You're invited: <strong>{invitation.title || 'Your Event'}</strong>. 
                Please respond here: <span className="text-blue-500 underline">invite.app/r/abc123</span>
              </p>
            </div>
          </div>

          {/* Web Preview */}
          <div className="web-preview">
            <div className="web-header">
              <div className="flex items-center gap-2 justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span className="font-bold text-lg">Inviter</span>
              </div>
            </div>

            <div className="invitation-content">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Hi there!</p>
              <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{invitation.title || 'Event Title'}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                From: <strong className="text-gray-900 dark:text-white">{invitation.creator_name || 'Your Name'}</strong>
              </p>

              {invitation.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {invitation.description}
                </p>
              )}

              <div className="space-y-2 mb-6">
                {invitation.event_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span>{formatDate(invitation.event_date)}</span>
                  </div>
                )}
                {invitation.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <MapPinIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span>{invitation.location}</span>
                  </div>
                )}
              </div>

              <p className="text-center font-medium mb-4 text-gray-900 dark:text-white">Do you accept the invitation?</p>

            <div className="response-buttons flex flex-col sm:flex-row gap-3 mt-4">
            <button className="response-btn yes-btn flex items-center justify-center gap-2 min-w-[120px] px-4 py-2 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{invitation.yes_text || "Yes"}</span>
            </button>
            <button className="response-btn no-btn flex items-center justify-center gap-2 min-w-[120px] px-4 py-2 rounded-lg">
                <XCircleIcon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{invitation.no_text || "No"}</span>
            </button>
            </div>

              <div className="mt-4">
                <textarea
                  className="w-full p-2 text-sm border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  placeholder="Add a message (optional)"
                  rows="2"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .invitation-preview-container {
          position: sticky;
          top: 2rem;
        }

       .phone-frame {
            width: 360px;
            height: 680px;
            border: 4px solid #1f2937;
            border-radius: 36px;
            background: #000;
            padding: 8px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            margin: 0 auto;
            }

            .phone-screen {
            width: 100%;
            height: 100%;
            background: #f9fafb;
            border-radius: 24px;
            overflow-y: auto;
            position: relative;
            /* Hide scrollbar for Chrome, Safari and Opera */
            &::-webkit-scrollbar {
                display: none;
            }
            /* Hide scrollbar for IE, Edge and Firefox */
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
            }

        .dark .phone-screen {
          background: #111827;
        }

        .sms-preview {
          padding: 1rem;
          background: #e5e7eb;
          border-bottom: 1px solid #d1d5db;
        }

        .dark .sms-preview {
          background: #1f2937;
          border-color: #374151;
        }

        .sms-bubble {
          background: white;
          padding: 0.75rem;
          border-radius: 1rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          color: #1f2937;
        }

        .dark .sms-bubble {
          background: #374151;
          color: #f3f4f6;
        }

        .web-preview {
          padding: 1.5rem;
        }

        .invitation-content {
          background: white;
          padding: 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .dark .invitation-content {
          background: #1f2937;
        }

        .response-buttons {
            display: flex;
            gap: 0.75rem;
            width: 100%;
            justify-content: center; /* Center buttons in container */
            flex-wrap: wrap; /* Allow wrapping on small screens */
            }

            .response-btn {
            /* Base button styles */
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            display: inline-flex; /* Changed from flex for better inline behavior */
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: all 0.2s ease;
            border: none;
            cursor: pointer;
            font-size: 0.875rem;
            min-width: 120px; /* Minimum width */
            max-width: 100%; /* Prevent overflow */
            box-sizing: border-box;
            text-align: center;
            white-space: nowrap; /* Prevent text wrapping */
            overflow: hidden;
            text-overflow: ellipsis; /* Add ellipsis if text too long */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin: 0; /* Remove margin to use gap instead */
            flex: 1 1 auto; /* Flexible but can shrink/grow */
            }

            /* Yes Button (Green) */
            .yes-btn {
            background: #10b981;
            color: white;
            }

            .yes-btn:hover {
            background: #059669;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            /* No Button (Red) */
            .no-btn {
            background: #ef4444;
            color: white;
            }

            .no-btn:hover {
            background: #dc2626;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            /* Active states */
            .yes-btn:active,
            .no-btn:active {
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }

            /* Icon sizing */
            .response-btn svg {
            width: 1.25rem;
            height: 1.25rem;
            flex-shrink: 0; /* Prevent icons from shrinking */
            }

            /* Responsive adjustments */
            @media (max-width: 480px) {
            .response-buttons {
                flex-direction: column; /* Stack vertically on small screens */
                width: 100%;
            }
            
            .response-btn {
                width: 100%; /* Full width buttons on mobile */
            }
            }
      `}</style>
    </div>
  );
}

export default InvitationPreview;