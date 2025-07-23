import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const LeaveReview = ({ technicianId, onReviewSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/technicians/${technicianId}/reviews`, {
        rating,
        comment,
      });
      setRating(5);
      setComment('');
      onReviewSubmit(); // Callback to refresh reviews
      toast.success('Review submitted successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Failed to submit review.';
      toast.error(errorMessage);
      console.error(err.response?.data);
    }
  };

  return (
    <div className="leave-review-card glass-container">
      <h3>Leave a Review</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Rating</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>
        <div className="form-group">
          <label>Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            required
          ></textarea>
        </div>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default LeaveReview;
