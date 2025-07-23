import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './Page.css';
import './Dashboard.css';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get('/api/bookings/my-bookings');
        // Sort latest first by scheduledDate and scheduledTime
        const sorted = res.data.sort((a, b) => {
          const dateA = new Date(a.scheduledDate + 'T' + (a.scheduledTime || '00:00'));
          const dateB = new Date(b.scheduledDate + 'T' + (b.scheduledTime || '00:00'));
          return dateB - dateA;
        });
        setBookings(sorted);
      } catch {
        setError('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'user') {
      fetchBookings();
    }
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.put(`/api/bookings/${bookingId}/status`, { status: 'cancelled' });
        setBookings(bookings => bookings.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
      } catch {
        alert('Failed to cancel booking.');
      }
    }
  };

  // Placeholder for review logic
  const handleReview = () => {
    alert('Review functionality coming soon!');
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
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

  if (!user || user.role !== 'user') {
    return (
      <div className="modern-dashboard">
        <div className="dashboard-container">
          <div className="content-card">
            <h2>Access Denied</h2>
            <p>You need to be a user to access this page.</p>
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
            <h1>My Bookings</h1>
            <p>Track your service requests and manage appointments</p>
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
                  {status === 'all' ? bookings.length : bookings.filter(b => b.status === status).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="jobs-container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your bookings...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="empty-jobs-state">
              <span className="empty-icon">📭</span>
              <h3>No bookings found</h3>
              <p>{filter === 'all' ? 'You have no bookings yet.' : `No ${filter} bookings found.`}</p>
              {filter === 'all' && (
                <a href="/search" className="empty-action">Find Services</a>
              )}
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredBookings.map(booking => {
                const isExpanded = expandedId === booking._id;
                return (
                  <div
                    key={booking._id}
                    className={`modern-job-card ${isExpanded ? 'expanded' : ''}`}
                  >
                    {/* Booking Header */}
                    <div
                      className="job-header"
                      onClick={() => setExpandedId(isExpanded ? null : booking._id)}
                    >
                      <div className="job-main-info">
                        <div className="job-service-title">
                          <h3>{booking.service}</h3>
                          <span className={`job-status-badge ${booking.status}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </span>
                        </div>
                        <div className="job-meta">
                          <span className="job-date">
                            📅 {booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'No date'}
                          </span>
                          {booking.scheduledTime && (
                            <span className="job-time">🕐 {booking.scheduledTime}</span>
                          )}
                          <span className="job-amount">💰 ₹{booking.totalAmount}</span>
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
                            <span className="detail-label">🔧 Technician</span>
                            <span className="detail-value">{booking.technician?.user?.name || 'Not assigned'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">📞 Contact</span>
                            <span className="detail-value">{booking.contactPhone}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">⏱️ Duration</span>
                            <span className="detail-value">{booking.duration} hour(s)</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">📊 Status</span>
                            <span className={`detail-value status-${booking.status}`}>
                              {getStatusIcon(booking.status)} {booking.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="detail-item full-width">
                            <span className="detail-label">📝 Description</span>
                            <span className="detail-value">{booking.description}</span>
                          </div>
                          <div className="detail-item full-width">
                            <span className="detail-label">📍 Service Address</span>
                            <span className="detail-value">
                              {booking.address?.street}, {booking.address?.city}, {booking.address?.state} - {booking.address?.pincode}
                            </span>
                          </div>
                          {booking.notes && (
                            <div className="detail-item full-width">
                              <span className="detail-label">💬 Special Notes</span>
                              <span className="detail-value">{booking.notes}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="job-actions">
                          {['pending', 'confirmed'].includes(booking.status) && (
                            <button
                              className="action-btn cancel"
                              onClick={() => handleCancel(booking._id)}
                            >
                              ❌ Cancel Booking
                            </button>
                          )}
                          {booking.status === 'completed' && (
                            <button
                              className="action-btn review"
                              onClick={() => handleReview()}
                            >
                              ⭐ Leave Review
                            </button>
                          )}
                          {booking.technician?.user?.name && (
                            <button
                              className="action-btn contact"
                              onClick={() => window.open(`tel:${booking.contactPhone}`)}
                            >
                              📞 Contact
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

export default MyBookings; 