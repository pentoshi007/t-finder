import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './Page.css';
import './Dashboard.css';

const Jobs = () => {
  const { user } = React.useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get('/api/bookings/technician-bookings');
        // Sort latest first by scheduledDate and scheduledTime
        const sorted = res.data.sort((a, b) => {
          const dateA = new Date(a.scheduledDate + 'T' + (a.scheduledTime || '00:00'));
          const dateB = new Date(b.scheduledDate + 'T' + (b.scheduledTime || '00:00'));
          return dateB - dateA;
        });
        setJobs(sorted);
      } catch {
        setError('Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };
    if (user && user.user && user.technician) {
      fetchJobs();
    }
  }, [user]);

  const handleAction = async (jobId, status) => {
    try {
      await axios.put(`/api/bookings/${jobId}/status`, { status });
      setJobs(jobs => jobs.map(j => j._id === jobId ? { ...j, status } : j));
    } catch {
      alert('Failed to update booking.');
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'completed': return '🎯';
      case 'cancelled': return '❌';
      case 'rejected': return '🚫';
      default: return '📋';
    }
  };

  if (!user || !user.user || !user.technician) {
    return (
      <div className="modern-dashboard">
        <div className="dashboard-container">
          <div className="content-card">
            <h2>Access Denied</h2>
            <p>You need to be a technician to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="jobs-header">
          <div className="jobs-title-section">
            <h1>My Jobs</h1>
            <p>Manage your service bookings and track progress</p>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
              <button
                key={status}
                className={`filter-tab ${filter === status ? 'active' : ''}`}
                onClick={() => setFilter(status)}
              >
                {getStatusIcon(status)}
                <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                <span className="tab-count">
                  {status === 'all' ? jobs.length : jobs.filter(j => j.status === status).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <div className="jobs-container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your jobs...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="empty-jobs-state">
              <span className="empty-icon">📭</span>
              <h3>No jobs found</h3>
              <p>{filter === 'all' ? 'You have no jobs yet.' : `No ${filter} jobs found.`}</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map(job => {
                const isExpanded = expandedId === job._id;
                return (
                  <div
                    key={job._id}
                    className={`modern-job-card ${isExpanded ? 'expanded' : ''}`}
                  >
                    {/* Job Header */}
                    <div
                      className="job-header"
                      onClick={() => setExpandedId(isExpanded ? null : job._id)}
                    >
                      <div className="job-main-info">
                        <div className="job-service-title">
                          <h3>{job.service}</h3>
                          <span className={`job-status-badge ${job.status}`}>
                            {getStatusIcon(job.status)}
                            {job.status}
                          </span>
                        </div>
                        <div className="job-meta">
                          <span className="job-date">
                            📅 {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : 'No date'}
                          </span>
                          {job.scheduledTime && (
                            <span className="job-time">🕐 {job.scheduledTime}</span>
                          )}
                          <span className="job-amount">💰 ₹{job.totalAmount}</span>
                        </div>
                      </div>
                      <div className="expand-icon">
                        {isExpanded ? '▲' : '▼'}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="job-details">
                        <div className="details-grid">
                          <div className="detail-item">
                            <span className="detail-label">👤 Customer</span>
                            <span className="detail-value">{job.user?.name || 'N/A'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">📞 Phone</span>
                            <span className="detail-value">{job.contactPhone}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">⏱️ Duration</span>
                            <span className="detail-value">{job.duration} hour(s)</span>
                          </div>
                          <div className="detail-item full-width">
                            <span className="detail-label">📝 Description</span>
                            <span className="detail-value">{job.description}</span>
                          </div>
                          <div className="detail-item full-width">
                            <span className="detail-label">📍 Address</span>
                            <span className="detail-value">
                              {job.address?.street}, {job.address?.city}, {job.address?.state} - {job.address?.pincode}
                            </span>
                          </div>
                          {job.notes && (
                            <div className="detail-item full-width">
                              <span className="detail-label">💬 Notes</span>
                              <span className="detail-value">{job.notes}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="job-actions">
                          {job.status === 'pending' && (
                            <>
                              <button
                                className="action-btn accept"
                                onClick={() => handleAction(job._id, 'confirmed')}
                              >
                                ✅ Accept Job
                              </button>
                              <button
                                className="action-btn reject"
                                onClick={() => handleAction(job._id, 'rejected')}
                              >
                                🚫 Reject
                              </button>
                            </>
                          )}
                          {job.status === 'confirmed' && (
                            <button
                              className="action-btn complete"
                              onClick={() => handleAction(job._id, 'completed')}
                            >
                              🎯 Mark Complete
                            </button>
                          )}
                          {['pending', 'confirmed'].includes(job.status) && (
                            <button
                              className="action-btn cancel"
                              onClick={() => handleAction(job._id, 'cancelled')}
                            >
                              ❌ Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs; 