import React from 'react';
import { Link } from 'react-router-dom';
import './TechnicianCard.css';

const TechnicianCard = ({ technician }) => {
  const { _id, user, category, city, averageRating } = technician;

  return (
    <Link to={`/technician/${_id}`} className="technician-card-link">
      <div className="technician-card glass-container">
        <div className="technician-card-header">
          <h3>{user.name}</h3>
          <span className="technician-rating">⭐ {averageRating.toFixed(1)}</span>
        </div>
        <div className="technician-card-body">
          <p className="technician-category">{category.name}</p>
          <p className="technician-city">{city}</p>
        </div>
      </div>
    </Link>
  );
};

export default TechnicianCard;
