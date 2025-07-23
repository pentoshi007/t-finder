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
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, { status: 'cancelled' });
      setBookings(bookings => bookings.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch {
      alert('Failed to cancel booking.');
    }
  };

  // Placeholder for review logic
  const handleReview = () => {
    alert('Review functionality coming soon!');
  };

  if (!user || user.role !== 'user') {
    return <div className="page-container"><div className="glass-container content-card">Access denied.</div></div>;
  }

  return (
    <div className="tech-dashboard-bg">
      <div className="tech-dashboard-card refined jobs-overhaul">
        <h1 className="tech-dashboard-title">My Bookings</h1>
        {loading ? (
          <p>Loading bookings...</p>
        ) : error ? (
          <p>{error}</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="jobs-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {bookings.map(booking => {
              const isExpanded = expandedId === booking._id;
              return (
                <div
                  key={booking._id}
                  className="job-card-overhaul"
                  style={{
                    background: isExpanded ? 'rgba(60, 60, 80, 0.95)' : 'rgba(44, 44, 62, 0.85)',
                    borderRadius: 18,
                    boxShadow: isExpanded ? '0 4px 24px 0 rgba(80,80,120,0.18)' : '0 2px 8px 0 rgba(40,40,60,0.10)',
                    padding: isExpanded ? '2rem 2.5rem 1.5rem 2.5rem' : '1.2rem 2rem',
                    margin: 0,
                    transition: 'background 0.2s, box-shadow 0.2s, padding 0.2s',
                    cursor: 'pointer',
                    border: isExpanded ? '2px solid #6c63ff' : '1.5px solid rgba(120,120,180,0.10)',
                  }}
                >
                  <div
                    className="job-row job-list-row"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontSize: '1.15rem', fontWeight: 500,
                      padding: isExpanded ? '0 0 1.2rem 0' : '0',
                      borderBottom: isExpanded ? '1px solid rgba(120,120,180,0.10)' : 'none',
                      marginBottom: isExpanded ? '1.2rem' : 0,
                      color: isExpanded ? '#fff' : '#e0e0e0',
                      background: isExpanded ? 'none' : 'none',
                      borderRadius: 0,
                      transition: 'color 0.2s',
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : booking._id)}
                    onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = 'rgba(120,120,180,0.07)'; }}
                    onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = 'none'; }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      {booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'N/A'}
                      {booking.scheduledTime && <span style={{ fontWeight: 400, color: '#b0b0ff' }}> &bull; {booking.scheduledTime}</span>}
                    </span>
                    <span className={`job-status-chip ${booking.status.toLowerCase()}`}
                      style={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        padding: '0.35em 1.1em',
                        borderRadius: 16,
                        background: booking.status === 'pending' ? 'rgba(255,180,60,0.18)' :
                                   booking.status === 'confirmed' ? 'rgba(60,200,120,0.18)' :
                                   booking.status === 'completed' ? 'rgba(60,180,255,0.18)' :
                                   booking.status === 'cancelled' ? 'rgba(180,60,255,0.18)' :
                                   booking.status === 'rejected' ? 'rgba(255,60,60,0.18)' : 'rgba(120,120,180,0.10)',
                        color: booking.status === 'pending' ? '#ffb43c' :
                               booking.status === 'confirmed' ? '#3cc878' :
                               booking.status === 'completed' ? '#3cb4ff' :
                               booking.status === 'cancelled' ? '#b43cff' :
                               booking.status === 'rejected' ? '#ff3c3c' : '#b0b0ff',
                        border: 'none',
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                      }}
                    >{booking.status.toUpperCase()}</span>
                    <span style={{ fontSize: '1.3rem', marginLeft: 8, color: '#b0b0ff' }}>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                  {isExpanded && (
                    <div className="job-details-expand" style={{ marginTop: '0.5rem', color: '#fff', fontSize: '1.05rem' }}>
                      <div className="job-row"><span className="job-label" style={{ fontWeight: 600 }}>Technician:</span> <span>{booking.technician?.user?.name || 'N/A'}</span></div>
                      <div className="job-row"><span className="job-label" style={{ fontWeight: 600 }}>Service:</span> <span>{booking.service}</span></div>
                      <div className="job-row"><span className="job-label" style={{ fontWeight: 600 }}>Description:</span> <span>{booking.description}</span></div>
                      <div className="job-row"><span className="job-label" style={{ fontWeight: 600 }}>Date:</span> <span>{booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'N/A'}</span></div>
                      <div className="job-row"><span className="job-label" style={{ fontWeight: 600 }}>Time:</span> <span>{booking.scheduledTime}</span></div>
                      <div className="job-row"><span className="job-label" style={{ fontWeight: 600 }}>Duration:</span> <span>{booking.duration} hour(s)</span></div>
                      <div className="job-row"><span className="job-label" style={{ fontWeight: 600 }}>Address:</span> <span>{booking.address?.street}, {booking.address?.city}, {booking.address?.state} - {booking.address?.pincode}</span></div>
                      <div className="job-row"><span className="job-label" style={{ fontWeight: 600 }}>Contact Phone:</span> <span>{booking.contactPhone}</span></div>
                      <div className="job-row"><span className="job-label" style={{ fontWeight: 600 }}>Notes:</span> <span>{booking.notes}</span></div>
                      <div className="job-row"><span className="job-label" style={{ fontWeight: 600 }}>Total Amount:</span> <span>₹{booking.totalAmount}</span></div>
                      <div className="job-row"><span className="job-label" style={{ fontWeight: 600 }}>Status:</span> <span className={`job-status-chip ${booking.status.toLowerCase()}`}>{booking.status.toUpperCase()}</span></div>
                      <div className="job-row" style={{ gap: '1.2rem', marginTop: '1.2rem', display: 'flex', flexWrap: 'wrap' }}>
                        {['pending', 'confirmed'].includes(booking.status) && (
                          <button className="btn-link refined" style={{ minWidth: 100, fontWeight: 600, fontSize: '1rem' }} onClick={() => handleCancel(booking._id)}>Cancel</button>
                        )}
                        {booking.status === 'completed' && (
                          <button className="btn-link secondary refined" style={{ minWidth: 100, fontWeight: 600, fontSize: '1rem' }} onClick={() => handleReview()}>Leave Review</button>
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
  );
};

export default MyBookings; 