// File: frontend/src/components/RecipientSelector.js
// Path: /inviter-app/frontend/src/components/RecipientSelector.js
// Description: Component for selecting invitation recipients

import React, { useState } from 'react';
import { XMarkIcon, UserPlusIcon, PhoneIcon } from '@heroicons/react/24/outline';

function RecipientSelector({ recipients, onChange }) {
  const [newRecipient, setNewRecipient] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState({});

  const validatePhone = (phone) => {
    // Basic phone validation - accepts 10 digits with optional formatting
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 10;
  };

  const handleAddRecipient = () => {
    const newErrors = {};
    
    if (!newRecipient.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!newRecipient.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(newRecipient.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check for duplicates
    const isDuplicate = recipients.some(r => r.phone === newRecipient.phone);
    if (isDuplicate) {
      setErrors({ phone: 'This number is already added' });
      return;
    }

    onChange([...recipients, { ...newRecipient, id: Date.now() }]);
    setNewRecipient({ name: '', phone: '' });
    setErrors({});
  };

  const handleRemoveRecipient = (id) => {
    onChange(recipients.filter(r => r.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRecipient();
    }
  };

  return (
    <div className="recipient-selector">
      {/* Add Recipient Form */}
      <div className="add-recipient-form">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Add Recipients
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={newRecipient.name}
              onChange={(e) => {
                setNewRecipient({ ...newRecipient, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              onKeyPress={handleKeyPress}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={newRecipient.phone}
                onChange={(e) => {
                  setNewRecipient({ ...newRecipient, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                onKeyPress={handleKeyPress}
                className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white ${
                  errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="(555) 123-4567"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleAddRecipient}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <UserPlusIcon className="w-4 h-4 mr-2" />
          Add Recipient
        </button>
      </div>

      {/* Recipients List */}
      <div className="recipients-list mt-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recipients ({recipients.length})
        </h3>

        {recipients.length === 0 ? (
          <div className="empty-recipients">
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No recipients added yet. Add recipients above to send invitations.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                className="recipient-item flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="recipient-avatar">
                    {recipient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {recipient.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {recipient.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveRecipient(recipient.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  aria-label="Remove recipient"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {recipients.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> Each recipient will receive an SMS with a unique link to respond to your invitation.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .recipient-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.125rem;
        }
      `}</style>
    </div>
  );
}

export default RecipientSelector;