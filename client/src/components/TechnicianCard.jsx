import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import './TechnicianCard.css';

const TechnicianCard = ({ technician }) => {
  const { _id, user, category, location, averageRating, experience, hourlyRate } = technician;

  return (
    <Link to={`/technician/${_id}`} className="technician-card-link" style={{ textDecoration: 'none', display: 'block' }}>
      <div className="technician-card home-card-override">
        <div className="tech-header">
          <div className="tech-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="tech-info">
            <h3 className="tech-name">{user?.name}</h3>
            <p className="tech-category">{category?.name}</p>
            <p className="tech-location">
              <FaMapMarkerAlt style={{ marginRight: '6px', color: '#6c63ff' }} />
              {location?.city || technician.city}
            </p>
          </div>
        </div>
        <div className="tech-rating">
          <span className="rating-stars">
            {[...Array(5)].map((_, i) => <FaStar key={i} />)}
          </span>
          <span className="rating-text">{averageRating ? averageRating.toFixed(1) : '4.8'}</span>
        </div>
        {experience && (
          <div className="tech-experience">
            {experience} years experience
          </div>
        )}
        <div className="tech-footer home-footer">
          <div className="tech-rate">
            <span className="rate-amount">₹{hourlyRate || 'N/A'}</span>
            <span className="rate-unit">/hour</span>
          </div>
          <button className="book-now-btn btn-animate">Show Profile</button>
        </div>
      </div>
    </Link>
  );
};

export default TechnicianCard;
