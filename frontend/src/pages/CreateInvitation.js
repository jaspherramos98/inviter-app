// File: frontend/src/pages/CreateInvitation.js
// Path: /inviter-app/frontend/src/pages/CreateInvitation.js
// Description: Multi-step invitation creation form with live preview

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import InvitationForm from '../components/InvitationForm';
import RecipientSelector from '../components/RecipientSelector';
import InvitationPreview from '../components/InvitationPreview';
import TemplateSelector from '../components/TemplateSelector';

function CreateInvitation() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
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
    expires_at: null
  });

  const handleTemplateSelect = (template) => {
    setFormData({
      ...formData,
      event_type: template.id,
      title: template.preview.title,
      description: template.preview.description,
      yes_text: template.preview.yes_text,
      no_text: template.preview.no_text,
      template_style: template.id
    });
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
        return formData.title && formData.description;
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
      showNotification('Please fill in all required fields', 'error');
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await api.post('/invitations', formData);
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
            <h2 className="step-title">Choose a Template</h2>
            <p className="step-description">
              Start with a template or create a custom invitation
            </p>
            <TemplateSelector onSelect={handleTemplateSelect} />
            <div className="mt-6 text-center">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setFormData({ ...formData, event_type: 'custom' });
                  setStep(2);
                }}
              >
                Skip & Create Custom
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="step-content">
            <h2 className="step-title">Invitation Details</h2>
            <p className="step-description">
              Fill in your invitation information
            </p>
            <div className="form-preview-container">
              <div className="form-section">
                <InvitationForm
                  formData={formData}
                  onChange={handleFormUpdate}
                />
              </div>
              <div className="preview-section">
                <InvitationPreview invitation={formData} />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="step-content">
            <h2 className="step-title">Select Recipients</h2>
            <p className="step-description">
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
            <h2 className="step-title">Review & Send</h2>
            <p className="step-description">
              Review your invitation before sending
            </p>
            <div className="review-container">
              <div className="review-section">
                <h3>Invitation Details</h3>
                <InvitationPreview invitation={formData} />
              </div>
              <div className="review-section">
                <h3>Recipients ({formData.recipients.length})</h3>
                <div className="recipient-list">
                  {formData.recipients.map((recipient, index) => (
                    <div key={index} className="recipient-item">
                      <span className="recipient-name">{recipient.name}</span>
                      <span className="recipient-phone">{recipient.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="review-actions">
                <p className="text-sm text-gray-600">
                  This will send {formData.recipients.length} SMS messages
                </p>
                <button
                  className="btn btn-primary"
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
    <div className="create-invitation">
      <div className="container">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-steps">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`progress-step ${step >= num ? 'active' : ''} ${step > num ? 'completed' : ''}`}
              >
                <div className="step-number">{num}</div>
                <div className="step-label">
                  {num === 1 && 'Template'}
                  {num === 2 && 'Details'}
                  {num === 3 && 'Recipients'}
                  {num === 4 && 'Review'}
                </div>
              </div>
            ))}
          </div>
          <div className="progress-line">
            <div
              className="progress-fill"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="step-navigation">
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
              className="btn btn-primary"
              onClick={handleNext}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateInvitation;