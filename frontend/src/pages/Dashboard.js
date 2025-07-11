// File: frontend/src/pages/Dashboard.js
// Path: /inviter-app/frontend/src/pages/Dashboard.js
// Description: Main dashboard component showing invitations and stats

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import StatsCard from '../components/StatsCard';
import InvitationList from '../components/InvitationList';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusIcon } from '@heroicons/react/24/outline';

function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch both analytics and invitations in parallel
      const [analyticsRes, invitationsRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/invitations')
      ]);
      
      setStats(analyticsRes.data);
      setInvitations(invitationsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredInvitations = () => {
    const now = new Date();
    switch (filter) {
      case 'active':
        return invitations.filter(inv => 
          !inv.expires_at || new Date(inv.expires_at) > now
        );
      case 'completed':
        return invitations.filter(inv => 
          inv.expires_at && new Date(inv.expires_at) <= now
        );
      default:
        return invitations;
    }
  };

  if (loading) return <LoadingSpinner />;

  const filteredInvitations = getFilteredInvitations();

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">Here's your invitation activity</p>
          </div>
          <Link to="/create" className="btn btn-primary">
            <PlusIcon className="w-5 h-5" />
            Create Invitation
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatsCard
            label="Total Invitations"
            value={stats?.total_invitations || 0}
            change={`${stats?.recent_activity?.last_week_invitations || 0} this week`}
            trend="up"
          />
          <StatsCard
            label="Response Rate"
            value={`${stats?.response_rate || 0}%`}
            change="5% from last month"
            trend="up"
          />
          <StatsCard
            label="Pending Responses"
            value={stats?.pending_responses || 0}
            change={`${stats?.total_responses_sent || 0} total sent`}
          />
          <StatsCard
            label="Unread Messages"
            value={stats?.unread_messages || 0}
            badge={stats?.unread_messages > 0}
          />
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({invitations.length})
          </button>
          <button
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({invitations.filter(i => !i.expires_at || new Date(i.expires_at) > new Date()).length})
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({invitations.filter(i => i.expires_at && new Date(i.expires_at) <= new Date()).length})
          </button>
        </div>

        {/* Invitations List */}
        <InvitationList 
          invitations={filteredInvitations}
          onRefresh={fetchDashboardData}
        />
      </div>
    </div>
  );
}

export default Dashboard;