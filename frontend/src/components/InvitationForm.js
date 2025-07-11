// File: frontend/src/components/InvitationForm.js
// Path: /inviter-app/frontend/src/components/InvitationForm.js
// Description: Form component for creating/editing invitation details

import React from 'react';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

function InvitationForm({ formData, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    onChange({ event_date: dateValue ? new Date(dateValue) : null });
  };

  const handleExpiryChange = (e) => {
    const dateValue = e.target.value;
    onChange({ expires_at: dateValue ? new Date(dateValue) : null });
  };

  return (
    <div className="invitation-form space-y-6">
      {/* Title */}
      <div className="form-group">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Invitation Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="e.g., Team Meeting, Birthday Party"
          required
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Add more details about your event..."
        />
      </div>

      {/* Event Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <CalendarIcon className="inline w-4 h-4 mr-1" />
            Event Date
          </label>
          <input
            type="date"
            id="event_date"
            name="event_date"
            value={formData.event_date ? new Date(formData.event_date).toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const dateValue = e.target.value;
              if (dateValue) {
                const currentTime = formData.event_date ? new Date(formData.event_date).toTimeString().slice(0, 5) : '12:00';
                // Create date in local timezone to avoid date shifting
                const [year, month, day] = dateValue.split('-');
                const [hours, minutes] = currentTime.split(':');
                const localDate = new Date(year, month - 1, day, hours, minutes);
                onChange({ event_date: localDate });
              } else {
                onChange({ event_date: null });
              }
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="form-group">
          <label htmlFor="event_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Event Time
          </label>
          <input
            type="time"
            id="event_time"
            name="event_time"
            value={formData.event_date ? new Date(formData.event_date).toTimeString().slice(0, 5) : ''}
            onChange={(e) => {
              const timeValue = e.target.value;
              if (timeValue && formData.event_date) {
                const existingDate = new Date(formData.event_date);
                const [hours, minutes] = timeValue.split(':');
                const localDate = new Date(
                  existingDate.getFullYear(),
                  existingDate.getMonth(),
                  existingDate.getDate(),
                  hours,
                  minutes
                );
                onChange({ event_date: localDate });
              } else if (timeValue) {
                // If no date is set, use today's date
                const today = new Date();
                const [hours, minutes] = timeValue.split(':');
                const localDate = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                  hours,
                  minutes
                );
                onChange({ event_date: localDate });
              }
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Location */}
      <div className="form-group">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <MapPinIcon className="inline w-4 h-4 mr-1" />
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="e.g., Zoom Meeting, 123 Main St, Conference Room A"
        />
      </div>

      {/* Response Options */}
      <div className="border-t pt-6 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Response Options</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="yes_text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Accept Button Text
            </label>
            <input
              type="text"
              id="yes_text"
              name="yes_text"
              value={formData.yes_text}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Yes, I'll attend"
            />
          </div>

          <div className="form-group">
            <label htmlFor="no_text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Decline Button Text
            </label>
            <input
              type="text"
              id="no_text"
              name="no_text"
              value={formData.no_text}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Can't make it"
            />
          </div>
        </div>
      </div>

      {/* Expiration */}
      <div className="form-group">
        <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Response Deadline (Optional)
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          After this date, recipients won't be able to respond
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            id="expires_date"
            name="expires_date"
            value={formData.expires_at ? new Date(formData.expires_at).toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const dateValue = e.target.value;
              if (dateValue) {
                const currentTime = formData.expires_at ? new Date(formData.expires_at).toTimeString().slice(0, 5) : '23:59';
                const [year, month, day] = dateValue.split('-');
                const [hours, minutes] = currentTime.split(':');
                const localDate = new Date(year, month - 1, day, hours, minutes);
                onChange({ expires_at: localDate });
              } else {
                onChange({ expires_at: null });
              }
            }}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="time"
            id="expires_time"
            name="expires_time"
            value={formData.expires_at ? new Date(formData.expires_at).toTimeString().slice(0, 5) : ''}
            onChange={(e) => {
              const timeValue = e.target.value;
              if (timeValue && formData.expires_at) {
                const dateStr = new Date(formData.expires_at).toISOString().split('T')[0];
                handleExpiryChange({ target: { value: `${dateStr}T${timeValue}` } });
              }
            }}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}

export default InvitationForm;