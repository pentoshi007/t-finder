import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FaHourglassHalf,
  FaCheckCircle,
  FaCheckDouble,
  FaTimesCircle,
  FaBan,
  FaClipboardList,
  FaExclamationTriangle,
  FaBoxOpen,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaWrench,
  FaPhoneAlt,
  FaChartBar,
  FaMapMarkerAlt,
  FaCommentDots,
  FaStar,
  FaInfoCircle
} from 'react-icons/fa';
import './Page.css';
import './Dashboard.css';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [reviewModal, setReviewModal] = useState({ open: false, technicianId: null, technicianName: '', bookingId: null });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewedTechs, setReviewedTechs] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({}); // { technicianId: [reviews] }

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

  // Fetch which technicians the user has already reviewed
  useEffect(() => {
    const fetchReviewedTechs = async () => {
      if (!user) return;
      try {
        // Get all reviews by this user
        const res = await axios.get('/api/technicians'); // get all techs
        const techIds = res.data.map(t => t._id);
        const reviewed = [];
        for (let techId of techIds) {
          const reviewsRes = await axios.get(`/api/technicians/${techId}/reviews`);
          if (reviewsRes.data.some(r => r.user && r.user._id === user._id)) {
            reviewed.push(techId);
          }
        }
        setReviewedTechs(reviewed);
      } catch {
        setReviewedTechs([]);
      }
    };
    fetchReviewedTechs();
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

  // Review modal logic
  const openReviewModal = (technicianId, technicianName, bookingId) => {
    setReviewModal({ open: true, technicianId, technicianName, bookingId });
    setReviewForm({ rating: 5, comment: '' });
  };
  const closeReviewModal = () => {
    setReviewModal({ open: false, technicianId: null, technicianName: '', bookingId: null });
  };
  const handleReviewChange = e => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };
  const handleReviewSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`/api/technicians/${reviewModal.technicianId}/reviews`, reviewForm, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setReviewedTechs([...reviewedTechs, reviewModal.technicianId]);
      closeReviewModal();
      toast.success('Review submitted!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Could not submit review');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaHourglassHalf />;
      case 'confirmed': return <FaCheckCircle />;
      case 'completed': return <FaCheckDouble />;
      case 'cancelled': return <FaTimesCircle />;
      case 'rejected': return <FaBan />;
      default: return <FaClipboardList />;
    }
  };

  // Fetch reviews for a technician when a booking is expanded
  const fetchReviewsForTechnician = async (technicianId) => {
    if (!technicianId || expandedReviews[technicianId]) return;
    try {
      const res = await axios.get(`/api/technicians/${technicianId}/reviews`);
      setExpandedReviews(prev => ({ ...prev, [technicianId]: res.data }));
    } catch {
      setExpandedReviews(prev => ({ ...prev, [technicianId]: [] }));
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
              <span className="error-icon"><FaExclamationTriangle /></span>
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="empty-jobs-state">
              <span className="empty-icon"><FaBoxOpen /></span>
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
                const alreadyReviewed = reviewedTechs.includes(booking.technician?._id);
                // Fetch reviews when expanded
                if (isExpanded && booking.technician?._id) fetchReviewsForTechnician(booking.technician._id);
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
                            <FaCalendarAlt style={{ marginRight: '6px' }} /> {booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'No date'}
                          </span>
                          {booking.scheduledTime && (
                            <span className="job-time"><FaClock style={{ marginRight: '6px' }} /> {booking.scheduledTime}</span>
                          )}
                          <span className="job-amount"><FaMoneyBillWave style={{ marginRight: '6px' }} /> ₹{booking.totalAmount}</span>
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
                            <span className="detail-label"><FaWrench style={{ marginRight: '6px' }} /> Technician</span>
                            <span className="detail-value">{booking.technician?.user?.name || 'Not assigned'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label"><FaPhoneAlt style={{ marginRight: '6px' }} /> Contact</span>
                            <span className="detail-value">{booking.contactPhone}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label"><FaClock style={{ marginRight: '6px' }} /> Duration</span>
                            <span className="detail-value">{booking.duration} hour(s)</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label"><FaChartBar style={{ marginRight: '6px' }} /> Status</span>
                            <span className={`detail-value status-${booking.status}`}>
                              {getStatusIcon(booking.status)} {booking.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="detail-item full-width">
                            <span className="detail-label"><FaClipboardList style={{ marginRight: '6px' }} /> Description</span>
                            <span className="detail-value">{booking.description}</span>
                          </div>
                          <div className="detail-item full-width">
                            <span className="detail-label"><FaMapMarkerAlt style={{ marginRight: '6px' }} /> Service Address</span>
                            <span className="detail-value">
                              {booking.address?.street}, {booking.address?.city}, {booking.address?.state} - {booking.address?.pincode}
                            </span>
                          </div>
                          {booking.notes && (
                            <div className="detail-item full-width">
                              <span className="detail-label"><FaCommentDots style={{ marginRight: '6px' }} /> Special Notes</span>
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
                              <FaTimesCircle style={{ marginRight: '6px' }} /> Cancel Booking
                            </button>
                          )}
                          {booking.status === 'completed' && !alreadyReviewed && (
                            <button
                              className="action-btn review"
                              onClick={() => openReviewModal(booking.technician._id, booking.technician.user.name, booking._id)}
                            >
                              <FaStar style={{ marginRight: '6px' }} /> Leave Review
                            </button>
                          )}
                          {booking.status === 'completed' && alreadyReviewed && (
                            <button className="action-btn review" disabled>
                              <FaCheckCircle style={{ marginRight: '6px' }} /> Reviewed
                            </button>
                          )}
                          {booking.technician?.user?.name && (
                            <button
                              className="action-btn contact"
                              onClick={() => window.open(`tel:${booking.contactPhone}`)}
                            >
                              <FaPhoneAlt style={{ marginRight: '6px' }} /> Contact
                            </button>
                          )}
                        </div>
                        {/* Show reviews for this technician */}
                        <div style={{ marginTop: 18 }}>
                          <h4 style={{ color: '#fff', marginBottom: 8 }}>Reviews for {booking.technician?.user?.name || 'Technician'}</h4>
                          {expandedReviews[booking.technician?._id] && expandedReviews[booking.technician._id].length > 0 ? (
                            <div className="reviews-list">
                              {expandedReviews[booking.technician._id].map((review) => (
                                <div key={review._id} className="review-card">
                                  <div className="review-header">
                                    <div className="reviewer-info">
                                      <div className="reviewer-avatar">
                                        {review.user?.name?.charAt(0).toUpperCase() || '?'}
                                      </div>
                                      <div>
                                        <h4>{review.user?.name || 'User'}</h4>
                                        <div className="review-rating">
                                          {[...Array(review.rating)].map((_, i) => <FaStar key={i} color="#ffd700" />)}
                                        </div>
                                      </div>
                                    </div>
                                    <span className="review-date">
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="review-comment">{review.comment}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="no-reviews">No reviews yet for this technician.</p>
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
      {/* Review Modal */}
      {reviewModal.open && (
        <div className="modal-overlay" onClick={closeReviewModal}>
          <div className="booking-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h2>Leave a Review for {reviewModal.technicianName}</h2>
              <button className="close-btn" onClick={closeReviewModal}>&times;</button>
            </div>
            <form className="booking-form" onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Rating</label>
                <select name="rating" value={reviewForm.rating} onChange={handleReviewChange} required>
                  {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r>1?'s':''}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea name="comment" value={reviewForm.comment} onChange={handleReviewChange} required rows={3} maxLength={400} placeholder="Share your experience..." />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeReviewModal}>Cancel</button>
                <button type="submit" className="book-btn btn-animate">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings; 