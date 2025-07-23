import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookAppointment = ({ technicianId }) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/appointments', {
        technicianId,
        date,
        description,
      });
      toast.success('Appointment requested successfully!');
      setDate('');
      setDescription('');
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Failed to book appointment.';
      toast.error(errorMessage);
      console.error(err.response?.data);
    }
  };

  return (
    <div className="book-appointment-card glass-container">
      <h3>Book an Appointment</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description of Work</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe the issue..."
            required
          ></textarea>
        </div>
        <button type="submit">Request Appointment</button>
      </form>
    </div>
  );
};

export default BookAppointment;
