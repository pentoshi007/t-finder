import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import useScrollAnimation from '../hooks/useScrollAnimation';
import './Page.css';
import './Technician.css';

const Technician = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const isTechnician = user && user.user && user.technician;
  const navigate = useNavigate();
  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [hasReviewed, setHasReviewed] = useState(false);
  const [canReview, setCanReview] = useState(false);

  const fetchTechnician = async () => {
    try {
      const res = await axios.get(`/api/technicians/${id}`);
      setTechnician(res.data);
    } catch {
      toast.error('Failed to load technician details');
    }
    setLoading(false);
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/technicians/${id}/reviews`);
      setReviews(res.data);
      if (user && res.data.some(r => r.user && r.user._id === user._id)) {
        setHasReviewed(true);
      } else {
        setHasReviewed(false);
      }
    } catch {
      setReviews([]);
    }
  };

  const checkCanReview = async () => {
    if (!user || user.role !== 'user') return setCanReview(false);
    try {
      const bookingsRes = await axios.get('/api/bookings/my-bookings', {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      const completed = bookingsRes.data.some(
        b => b.technician && b.technician._id === id && b.status === 'completed'
      );
      setCanReview(completed);
    } catch {
      setCanReview(false);
    }
  };

  // Initialize scroll animations
  useScrollAnimation();

  useEffect(() => {
    fetchTechnician();
    fetchReviews();
    checkCanReview();
    // eslint-disable-next-line
  }, [id, user]);

  const handleBookingSuccess = (booking) => {
    toast.success('Booking created successfully!');
    console.log('Booking created:', booking);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  // Review form handlers
  const handleReviewChange = e => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };
  const handleReviewSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`/api/technicians/${id}/reviews`, reviewForm, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      toast.success('Review submitted!');
      setShowReviewModal(false);
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
      setHasReviewed(true);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not submit review');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading technician details...</p>
        </div>
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Technician not found</h2>
          <p>The technician you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const averageRating = technician.averageRating || 4.5;

  return (
    <div className="page-container">
      <div className="technician-profile tech-profile-animate">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-avatar">
            {technician.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{technician.user.name}</h1>
            <p className="profile-category">{technician.category.name}</p>
            <p className="profile-location">
              <FaMapMarkerAlt size={14} style={{ marginRight: '6px', color: '#6c63ff' }} />  
              {technician.location.city}
            </p>

            <div className="profile-rating">
              <div className="stars">
                {renderStars(averageRating)}
              </div>
              <span className="rating-text">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>

            <div className="profile-badges">
              <span className="experience-badge">
                {technician.experience} years experience
              </span>
              <span className="availability-badge">
                {technician.availability}
              </span>
            </div>
          </div>

          <div className="profile-actions">
            <div className="hourly-rate">
              <span className="rate-amount">₹{technician.hourlyRate}</span>
              <span className="rate-unit">/hour</span>
            </div>

            {!isAuthenticated ? (
              <button
                className="book-service-btn"
                onClick={() => navigate('/login')}
              >
                Login to Book
              </button>
            ) : user?.role !== 'technician' && !isTechnician && (
              <button
                className="book-service-btn"
                onClick={() => setShowBookingModal(true)}
              >
                Book Service
              </button>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="profile-content">
          <div className="content-main">
            {/* About Section */}
            <div className="section">
              <h3>About</h3>
              <p className="bio">{technician.bio}</p>
            </div>

            {/* Skills Section */}
            <div className="section">
              <h3>Skills & Expertise</h3>
              <div className="skills-list">
                {technician.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="section">
              <h3>Customer Reviews</h3>
              {user && canReview && !hasReviewed && (
                <button className="btn-animate" style={{ marginBottom: 16 }} onClick={() => setShowReviewModal(true)}>
                  Leave a Review
                </button>
              )}
              {reviews.length > 0 ? (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">
                            {review.user?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <h4>{review.user?.name || 'User'}</h4>
                            <div className="review-rating">
                              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
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
                <p className="no-reviews">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="content-sidebar">
            <div className="sidebar-card">
              <h4>Service Details</h4>
              <div className="service-info">
                <div className="info-item">
                  <span className="info-label">Category:</span>
                  <span className="info-value">{technician.category.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Experience:</span>
                  <span className="info-value">{technician.experience} years</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Hourly Rate:</span>
                  <span className="info-value">₹{technician.hourlyRate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Availability:</span>
                  <span className="info-value">{technician.availability}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{technician.location.city}</span>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h4>Contact Information</h4>
              <div className="contact-info">
                <p><FaEnvelope className="contact-icon" /> {technician.user.email}</p>
                <p><FaPhoneAlt className="contact-icon" /> {technician.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="booking-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h2>Leave a Review</h2>
              <button className="close-btn" onClick={() => setShowReviewModal(false)}>&times;</button>
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
                <button type="button" className="cancel-btn" onClick={() => setShowReviewModal(false)}>Cancel</button>
                <button type="submit" className="book-btn btn-animate">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Booking Modal */}
      <BookingModal
        technician={technician}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default Technician;
