// File: frontend/src/components/TemplateSelector.js
// Path: /inviter-app/frontend/src/components/TemplateSelector.js
// Description: Template selection component for invitation creation

import React from 'react';
import { 
  CalendarIcon, 
  CakeIcon, 
  AcademicCapIcon, 
  HeartIcon,
  BriefcaseIcon,
  UserGroupIcon,
  SparklesIcon,
  PlusIcon 
} from '@heroicons/react/24/outline';

const templates = [
  {
    id: 'meeting_virtual',
    name: 'Virtual Meeting',
    icon: BriefcaseIcon,
    category: 'Professional',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    preview: {
      title: 'Team Meeting',
      description: 'Join us for our weekly team sync to discuss project progress',
      yes_text: "Accept",
      no_text: "Decline"
    }
  },
  {
    id: 'meeting_physical',
    name: 'In-Person Meeting',
    icon: UserGroupIcon,
    category: 'Professional',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    preview: {
      title: 'Office Meeting',
      description: 'Please join us for an important discussion',
      yes_text: "Accept",
      no_text: "Decline"
    }
  },
  {
    id: 'birthday',
    name: 'Birthday Party',
    icon: CakeIcon,
    category: 'Social',
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
    preview: {
      title: 'Birthday Celebration',
      description: "You're invited to celebrate with us!",
      yes_text: 'Accept',
      no_text: 'Decline'
    }
  },
  {
    id: 'wedding',
    name: 'Wedding',
    icon: HeartIcon,
    category: 'Formal',
    color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    preview: {
      title: 'Wedding Invitation',
      description: 'We request the honor of your presence at our wedding',
      yes_text: 'Accept',
      no_text: 'Decline'
    }
  },
  {
    id: 'conference',
    name: 'Conference',
    icon: AcademicCapIcon,
    category: 'Professional',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    preview: {
      title: 'Annual Conference',
      description: 'Join us for insights and networking',
      yes_text: "Accept",
      no_text: 'Decline'
    }
  },
  {
    id: 'social_gathering',
    name: 'Social Gathering',
    icon: SparklesIcon,
    category: 'Social',
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    preview: {
      title: 'Get Together',
      description: "Let's catch up and have some fun!",
      yes_text: 'Accept',
      no_text: "Decline"
    }
  }
];

function TemplateSelector({ onSelect }) {
  return (
    <div className="template-grid">
      {templates.map((template) => {
        const Icon = template.icon;
        return (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className="template-card group"
          >
            <div className={`template-icon ${template.color}`}>
              <Icon className="w-8 h-8" />
            </div>
            <h3 className="template-name">{template.name}</h3>
            <p className="template-category">{template.category}</p>
            <div className="template-preview">
              <p className="text-sm font-medium">{template.preview.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {template.preview.description}
              </p>
            </div>
          </button>
        );
      })}
      
      {/* Custom Template Option */}
      <button
        onClick={() => onSelect({ id: 'custom', name: 'Custom' })}
        className="template-card group border-2 border-dashed border-gray-300 dark:border-gray-600"
      >
        <div className="template-icon bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          <PlusIcon className="w-8 h-8" />
        </div>
        <h3 className="template-name">Custom Invitation</h3>
        <p className="template-category">Start from scratch</p>
        <div className="template-preview">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create your own unique invitation
          </p>
        </div>
      </button>

      <style jsx>{`
        .template-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .template-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          text-align: left;
          transition: all 0.3s;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .dark .template-card {
          background: #1f2937;
          border-color: #374151;
        }

        .template-card:hover {
          border-color: #6366f1;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .template-icon {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .template-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
        }

        .dark .template-name {
          color: #f3f4f6;
        }

        .template-category {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .dark .template-category {
          color: #9ca3af;
        }

        .template-preview {
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e5e7eb;
        }

        .dark .template-preview {
          border-color: #374151;
        }
      `}</style>
    </div>
  );
}

export default TemplateSelector;