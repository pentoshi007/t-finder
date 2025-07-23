import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './Page.css';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [jobs, setJobs] = useState([]);

  const isTechnician = user && user.user && user.technician;

  useEffect(() => {
    if (isTechnician) {
      const fetchJobs = async () => {
        const res = await axios.get('/api/bookings/technician-bookings');
        setJobs(res.data);
      };
      fetchJobs();
    } else if (user) {
      const fetchAppointments = async () => {
        try {
          const res = await axios.get('/api/bookings/my-bookings');
          setAppointments(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchAppointments();
    }
  }, [user, isTechnician]);

  if (isTechnician) {
    const tech = user.technician;
    const name = user.user.name;
    const email = user.user.email;
    const category = tech.category?.name || '';
    const experience = tech.experience;
    const hourlyRate = tech.hourlyRate;
    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(j => j.status === 'completed').length;
    const pendingJobs = jobs.filter(j => j.status === 'pending').length;
    return (
      <div className="tech-dashboard-bg">
        <div className="tech-dashboard-card refined">
          <div className="tech-dashboard-avatar big">{name.charAt(0).toUpperCase()}</div>
          <h1 className="tech-dashboard-title">Welcome, {name}</h1>
          <div className="tech-dashboard-profile refined">
            <div><span>Email:</span> {email}</div>
            <div><span>Category:</span> {category}</div>
            <div><span>Experience:</span> {experience} years</div>
            <div><span>Hourly Rate:</span> ₹{hourlyRate}</div>
          </div>
          <div className="tech-dashboard-stats refined">
            <div className="stat-card refined total">
              <div className="stat-icon">📋</div>
              <div className="stat-label">Total</div>
              <div className="stat-value">{totalJobs}</div>
            </div>
            <div className="stat-card refined completed">
              <div className="stat-icon">✅</div>
              <div className="stat-label">Completed</div>
              <div className="stat-value">{completedJobs}</div>
            </div>
            <div className="stat-card refined pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-label">Pending</div>
              <div className="stat-value">{pendingJobs}</div>
            </div>
          </div>
          <div className="tech-dashboard-actions refined">
            <a href="/jobs" className="btn-link refined">View My Jobs</a>
            <a href="/edit-profile" className="btn-link secondary refined">Edit Profile</a>
          </div>
        </div>
      </div>
    );
  }

  if (!isTechnician && user) {
    const name = user.name;
    const email = user.email;
    const totalBookings = appointments.length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const upcoming = appointments.filter(a => a.status === 'confirmed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled' || a.status === 'rejected').length;
    return (
      <div className="tech-dashboard-bg">
        <div className="tech-dashboard-card refined user-dashboard">
          <div className="tech-dashboard-avatar big user">{name.charAt(0).toUpperCase()}</div>
          <h1 className="tech-dashboard-title">Welcome, {name}</h1>
          <div className="tech-dashboard-profile refined">
            <div><span>Email:</span> {email}</div>
            <div><span>Role:</span> User</div>
          </div>
          <div className="tech-dashboard-stats refined">
            <div className="stat-card refined total">
              <div className="stat-icon">📋</div>
              <div className="stat-label">Total</div>
              <div className="stat-value">{totalBookings}</div>
            </div>
            <div className="stat-card refined completed">
              <div className="stat-icon">✅</div>
              <div className="stat-label">Completed</div>
              <div className="stat-value">{completed}</div>
            </div>
            <div className="stat-card refined pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-label">Upcoming</div>
              <div className="stat-value">{upcoming}</div>
            </div>
            <div className="stat-card refined cancelled">
              <div className="stat-icon">❌</div>
              <div className="stat-label">Cancelled</div>
              <div className="stat-value">{cancelled}</div>
            </div>
          </div>
          <div className="tech-dashboard-actions refined">
            <a href="/my-bookings" className="btn-link refined">View My Bookings</a>
            <a href="/edit-profile" className="btn-link secondary refined">Edit Profile</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="glass-container content-card">
        <h1>Dashboard</h1>
        {user && (
          <div>
            <h2>Welcome, {user.name}</h2>
            <p>Email: {user.email}</p>
            <Link to="/edit-profile" className="btn-link">Edit Profile</Link>
          </div>
        )}

        <div className="appointments-section">
          <h2>My Appointments</h2>
          {appointments.length > 0 ? (
            <ul className="appointments-list">
              {appointments.map((apt) => (
                <li key={apt._id} className="appointment-item">
                  <p><strong>Technician:</strong> {apt.technician.user.name}</p>
                  <p><strong>Date:</strong> {new Date(apt.date).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> <span className={`status status-${apt.status.toLowerCase()}`}>{apt.status}</span></p>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no appointments.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
