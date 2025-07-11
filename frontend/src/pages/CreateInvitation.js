// File: frontend/src/pages/CreateInvitation.js
// Path: /inviter-app/frontend/src/pages/CreateInvitation.js
// Description: Multi-step invitation creation form with live preview

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import InvitationForm from '../components/InvitationForm';
import RecipientSelector from '../components/RecipientSelector';
import InvitationPreview from '../components/InvitationPreview';
import TemplateSelector from '../components/TemplateSelector';

function CreateInvitation() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'custom',
    event_date: null,
    location: '',
    yes_text: 'Yes, I\'ll attend',
    no_text: 'Can\'t make it',
    template_style: null,
    custom_fields: {},
    recipients: [],
    expires_at: null,
    creator_name: user?.name || 'Inviter User'
  });

  const handleTemplateSelect = (template) => {
    if (template.preview) {
      setFormData({
        ...formData,
        event_type: template.id,
        title: template.preview.title,
        description: template.preview.description,
        yes_text: template.preview.yes_text,
        no_text: template.preview.no_text,
        template_style: template.id
      });
    }
    setStep(2);
  };

  const handleFormUpdate = (updates) => {
    setFormData({ ...formData, ...updates });
  };

  const handleRecipientsUpdate = (recipients) => {
    setFormData({ ...formData, recipients });
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 2:
        return formData.title && formData.title.trim() !== '';
      case 3:
        return formData.recipients.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      if (step === 2) {
        showNotification('Please fill in the invitation title', 'error');
      } else if (step === 3) {
        showNotification('Please add at least one recipient', 'error');
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Transform recipients to match backend format
      const recipientsData = formData.recipients.map(r => ({
        name: r.name,
        phone: r.phone
      }));

      const invitationData = {
        ...formData,
        recipients: recipientsData
      };

      const response = await api.post('/invitations', invitationData);
      showNotification('Invitation created and sent successfully!', 'success');
      navigate(`/invitation/${response.data.id}`);
    } catch (error) {
      showNotification(
        error.response?.data?.detail || 'Failed to create invitation',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose a Template</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start with a template or create a custom invitation
            </p>
            <TemplateSelector onSelect={handleTemplateSelect} />
          </div>
        );
      
      case 2:
        return (
          <div className="step-content">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invitation Details</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Fill in your invitation information
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="form-section">
                <InvitationForm
                  formData={formData}
                  onChange={handleFormUpdate}
                />
              </div>
              <div className="preview-section hidden lg:block">
                <InvitationPreview invitation={formData} />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="step-content">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select Recipients</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add recipients from your contacts or enter phone numbers
            </p>
            <RecipientSelector
              recipients={formData.recipients}
              onChange={handleRecipientsUpdate}
            />
          </div>
        );
      
      case 4:
        return (
          <div className="step-content">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Review & Send</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Review your invitation before sending
            </p>
            <div className="review-container grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="review-section">
                <h3 className="text-lg font-semibold mb-4">Invitation Details</h3>
                <InvitationPreview invitation={formData} />
              </div>
              <div className="review-section">
                <h3 className="text-lg font-semibold mb-4">Recipients ({formData.recipients.length})</h3>
                <div className="space-y-2 mb-6">
                  {formData.recipients.map((recipient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium">{recipient.name}</span>
                      <span className="text-gray-500 dark:text-gray-400">{recipient.phone}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    This will send {formData.recipients.length} SMS message{formData.recipients.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  className="w-full btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Invitations'}
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="create-invitation max-w-7xl mx-auto">
    {/* Enhanced Progress Bar */}
    <div className="mb-8 relative">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-0"></div>
        
        {/* Filled progress line */}
        <div 
          className="absolute top-5 left-0 h-1 bg-indigo-600 z-10 transition-all duration-300 ease-in-out"
          style={{
            width: `${(step - 1) / 3 * 100}%`
          }}
        ></div>
        
        {/* Steps */}
        {[1, 2, 3, 4].map((num) => (
          <div
            key={num}
            className={`relative z-20 flex flex-col items-center transition-all duration-300 ${
              step === num ? 'scale-110' : 'scale-100'
            }`}
            style={{
              flex: step === num ? '1 0 auto' : '1 1 auto',
              transform: step === num ? 'translateY(-5px)' : 'none'
            }}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                step >= num
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              } ${
                step === num ? 'ring-4 ring-indigo-300 dark:ring-indigo-800' : ''
              }`}
            >
              {step > num ? '✓' : num}
            </div>
            <span className={`text-xs mt-2 transition-all duration-300 ${
              step === num 
                ? 'text-indigo-600 dark:text-indigo-400 font-medium' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {num === 1 && 'Template'}
              {num === 2 && 'Details'}
              {num === 3 && 'Recipients'}
              {num === 4 && 'Review'}
            </span>
          </div>
        ))}
      </div>
    </div>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            className="btn btn-secondary"
            onClick={handleBack}
            disabled={loading}
          >
            Back
          </button>
        )}
        {step < 4 && (
          <button
            className="btn btn-primary ml-auto"
            onClick={handleNext}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

export default CreateInvitation;