import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import AuthContext from '../context/AuthContext';
import './BookingModal.css';

const BookingModal = ({ technician, isOpen, onClose, onBookingSuccess }) => {
    // const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        service: '',
        description: '',
        scheduledDate: '',
        scheduledTime: '',
        duration: 2,
        address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
        },
        contactPhone: '',
        notes: ''
    });
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (formData.scheduledDate && technician) {
            fetchAvailableSlots();
        }
    }, [formData.scheduledDate, technician]);

    const fetchAvailableSlots = async () => {
        try {
            const res = await axios.get(`/api/bookings/available-slots/${technician._id}?date=${formData.scheduledDate}`);
            setAvailableSlots(res.data.availableSlots);
        } catch (err) {
            console.error('Error fetching available slots:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const bookingData = {
                technicianId: technician._id,
                ...formData
            };
            const res = await axios.post('/api/bookings', bookingData);
            onBookingSuccess(res.data);
            onClose();
            setFormData({
                service: '',
                description: '',
                scheduledDate: '',
                scheduledTime: '',
                duration: 2,
                address: {
                    street: '',
                    city: '',
                    state: '',
                    pincode: ''
                },
                contactPhone: '',
                notes: ''
            });
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    const getTotalAmount = () => {
        return technician ? technician.hourlyRate * formData.duration : 0;
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    if (!isOpen || !technician) return null;

    return (
        <div className="modal-overlay modal-overlay-animate" onClick={onClose}>
            <div className="booking-modal modal-animate" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Book Service</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="technician-info">
                    <div className="tech-avatar">
                        {technician.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3>{technician.user.name}</h3>
                        <p>{technician.category.name}</p>
                        <p>₹{technician.hourlyRate}/h</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="booking-form form-animate">
                    {error && <div className="error-message error-shake">{error}</div>}

                    <div className="form-group">
                        <label>Service Type *</label>
                        <input
                            type="text"
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            placeholder="e.g., AC Repair, Plumbing Fix"
                            className="form-input-animate"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the issue or service needed"
                            className="form-input-animate"
                            rows="3"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Date *</label>
                            <input
                                type="date"
                                name="scheduledDate"
                                value={formData.scheduledDate}
                                onChange={handleChange}
                                className="form-input-animate"
                                min={getMinDate()}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Time *</label>
                            <select
                                name="scheduledTime"
                                value={formData.scheduledTime}
                                onChange={handleChange}
                                className="form-input-animate"
                                required
                                disabled={!formData.scheduledDate}
                            >
                                <option value="">Select Time</option>
                                {availableSlots.map(slot => (
                                    <option key={slot} value={slot}>
                                        {slot} - {(parseInt(slot.split(':')[0]) + 1).toString().padStart(2, '0')}:00
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Duration (hours) *</label>
                            <select
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="form-input-animate"
                                required
                            >
                                <option value={1}>1 hour</option>
                                <option value={2}>2 hours</option>
                                <option value={3}>3 hours</option>
                                <option value={4}>4 hours</option>
                                <option value={6}>6 hours</option>
                                <option value={8}>8 hours</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Street *</label>
                            <input
                                type="text"
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>City *</label>
                            <input
                                type="text"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>State *</label>
                            <input
                                type="text"
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Pincode *</label>
                            <input
                                type="text"
                                name="address.pincode"
                                value={formData.address.pincode}
                                onChange={handleChange}
                                pattern="[0-9]{6}"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Contact Phone *</label>
                        <input
                            type="tel"
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleChange}
                            placeholder="Your contact number"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Additional Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Any special instructions or requirements"
                            rows="2"
                        />
                    </div>

                    <div className="booking-summary">
                        <div className="summary-row">
                            <span>Service Duration:</span>
                            <span>{formData.duration} hour(s)</span>
                        </div>
                        <div className="summary-row">
                            <span>Hourly Rate:</span>
                            <span>₹{technician.hourlyRate}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total Amount:</span>
                            <span>₹{getTotalAmount()}</span>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="book-btn btn-animate">
                            {loading ? 'Booking...' : 'Book Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;