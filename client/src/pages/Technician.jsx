import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import './Page.css';
import './Technician.css';

const Technician = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const isTechnician = user && user.user && user.technician;
  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [reviews, setReviews] = useState([]);

  const fetchTechnician = async () => {
    try {
      const res = await axios.get(`/api/technicians/${id}`);
      setTechnician(res.data);
      // Mock reviews for now - you can implement actual reviews later
      setReviews([
        {
          _id: '1',
          user: { name: 'John Doe' },
          rating: 5,
          comment: 'Excellent service! Very professional and fixed the issue quickly.',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          user: { name: 'Jane Smith' },
          rating: 4,
          comment: 'Good work, arrived on time and completed the job efficiently.',
          createdAt: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load technician details');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTechnician();
  }, [id]);

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
      <div className="technician-profile">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-avatar">
            {technician.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{technician.user.name}</h1>
            <p className="profile-category">{technician.category.name}</p>
            <p className="profile-location">📍 {technician.location.city}</p>

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

            {isAuthenticated && user?.role !== 'technician' && !isTechnician && (
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
              {reviews.length > 0 ? (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">
                            {review.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4>{review.user.name}</h4>
                            <div className="review-rating">
                              {renderStars(review.rating)}
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
                <p>📧 {technician.user.email}</p>
                <p>📞 {technician.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
