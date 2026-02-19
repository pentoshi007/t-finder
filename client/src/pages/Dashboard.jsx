import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaClipboardList,
  FaCog,
  FaSearch,
  FaMoneyBillWave,
  FaChartLine,
  FaCheckCircle,
  FaHourglassHalf,
  FaCreditCard,
  FaChartBar,
  FaCalendarAlt,
  FaBoxOpen,
  FaChartPie,
  FaCalendarDay,
  FaGem,
  FaBullseye,
  FaMoneyBill
} from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import './Page.css';
import './Dashboard.css';
import './Dashboard-mobile.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const isTechnician = user && user.user && user.technician;

  // Initialize scroll animations
  useScrollAnimation();

  useEffect(() => {
    if (isTechnician) {
      const fetchJobs = async () => {
        try {
          const res = await axios.get('/api/bookings/technician-bookings');
          setJobs(res.data);
          // Set recent activity for technicians
          const recent = res.data
            .sort((a, b) => new Date(b.createdAt || b.scheduledDate) - new Date(a.createdAt || a.scheduledDate))
            .slice(0, 3);
          setRecentActivity(recent);
        } catch (err) {
          console.error(err);
        }
      };
      fetchJobs();
    } else if (user) {
      const fetchAppointments = async () => {
        try {
          const res = await axios.get('/api/bookings/my-bookings');
          setAppointments(res.data);
          // Set recent activity for users
          const recent = res.data
            .sort((a, b) => new Date(b.createdAt || b.scheduledDate) - new Date(a.createdAt || a.scheduledDate))
            .slice(0, 3);
          setRecentActivity(recent);
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
    const confirmedJobs = jobs.filter(j => j.status === 'confirmed').length;

    // Calculate earnings
    const totalEarnings = jobs
      .filter(j => j.status === 'completed')
      .reduce((sum, job) => sum + (job.totalAmount || 0), 0);
    const thisMonthJobs = jobs.filter(j => {
      const jobDate = new Date(j.scheduledDate || j.createdAt);
      const now = new Date();
      return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear();
    });
    const thisMonthEarnings = thisMonthJobs
      .filter(j => j.status === 'completed')
      .reduce((sum, job) => sum + (job.totalAmount || 0), 0);
    const avgJobValue = completedJobs > 0 ? Math.round(totalEarnings / completedJobs) : 0;

    return (
      <div className="modern-dashboard page-refresh-enter">
        <div className="dashboard-container">
          {/* Header Section */}
          <div className="dashboard-header profile-card-animate">
            <div className="user-welcome">
              <div className="user-avatar technician">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h1>Welcome back, {name}!</h1>
                <p className="user-subtitle">{category} • {experience} years experience</p>
              </div>
            </div>
            <div className="header-actions">
              <Link to="/jobs" className="action-btn primary btn-animate">
                <span className="btn-icon"><FaClipboardList /></span>
                View Jobs
              </Link>
              <Link to="/edit-profile" className="action-btn secondary btn-animate">
                <span className="btn-icon"><FaCog /></span>
                Settings
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid animate-on-scroll stagger-animate">
            <div className="stat-card earnings card-hover">
              <div className="stat-icon"><FaMoneyBillWave /></div>
              <div className="stat-content">
                <h3>₹{totalEarnings.toLocaleString()}</h3>
                <p>Total Earnings</p>
              </div>
              <div className="stat-trend">All time</div>
            </div>
            <div className="stat-card monthly card-hover">
              <div className="stat-icon"><FaChartLine /></div>
              <div className="stat-content">
                <h3>₹{thisMonthEarnings.toLocaleString()}</h3>
                <p>This Month</p>
              </div>
              <div className="stat-badge">{thisMonthJobs.length} jobs</div>
            </div>
            <div className="stat-card completed card-hover">
              <div className="stat-icon"><FaCheckCircle /></div>
              <div className="stat-content">
                <h3>{completedJobs}</h3>
                <p>Completed</p>
              </div>
              <div className="stat-trend">₹{avgJobValue} avg</div>
            </div>
            <div className="stat-card pending card-hover">
              <div className="stat-icon"><FaHourglassHalf /></div>
              <div className="stat-content">
                <h3>{pendingJobs}</h3>
                <p>Pending</p>
              </div>
              <div className="stat-badge">{pendingJobs > 0 ? 'New' : 'None'}</div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="content-grid animate-on-scroll">
            {/* Recent Activity */}
            <div className="content-card card-animate">
              <div className="card-header">
                <h2>Recent Activity</h2>
                <Link to="/jobs" className="view-all btn-animate">View All</Link>
              </div>
              <div className="activity-list">
                {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                  <div key={activity._id || index} className="activity-item">
                    <div className={`activity-status ${activity.status}`}></div>
                    <div className="activity-content">
                      <h4>{activity.service}</h4>
                      <p>{activity.user?.name || 'Unknown User'}</p>
                      <span className="activity-time">
                        {activity.scheduledDate ? new Date(activity.scheduledDate).toLocaleDateString() : 'No date'}
                      </span>
                    </div>
                    <div className={`status-badge ${activity.status}`}>
                      {activity.status}
                    </div>
                  </div>
                )) : (
                  <div className="empty-state">
                    <span className="empty-icon"><FaBoxOpen /></span>
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Earnings & Performance */}
            <div className="content-card card-animate">
              <div className="card-header">
                <h2>Earnings & Performance</h2>
              </div>
              <div className="performance-metrics">
                <div className="metric">
                  <div className="metric-label"><FaMoneyBill style={{ marginRight: '6px' }} /> Hourly Rate</div>
                  <div className="metric-value">₹{hourlyRate}</div>
                </div>
                <div className="metric">
                  <div className="metric-label"><FaChartPie style={{ marginRight: '6px' }} /> Success Rate</div>
                  <div className="metric-value">{totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0}%</div>
                </div>
                <div className="metric">
                  <div className="metric-label"><FaCalendarDay style={{ marginRight: '6px' }} /> This Month</div>
                  <div className="metric-value">{thisMonthJobs.length} jobs</div>
                </div>
                <div className="metric">
                  <div className="metric-label"><FaGem style={{ marginRight: '6px' }} /> Avg Job Value</div>
                  <div className="metric-value">₹{avgJobValue}</div>
                </div>
                <div className="metric">
                  <div className="metric-label"><FaBullseye style={{ marginRight: '6px' }} /> Active Jobs</div>
                  <div className="metric-value">{confirmedJobs}</div>
                </div>
              </div>
            </div>
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

    // Calculate spending
    const totalSpent = appointments
      .filter(a => a.status === 'completed')
      .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    const thisMonthBookings = appointments.filter(a => {
      const bookingDate = new Date(a.scheduledDate || a.createdAt);
      const now = new Date();
      return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
    });
    const thisMonthSpent = thisMonthBookings
      .filter(a => a.status === 'completed')
      .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    const avgBookingValue = completed > 0 ? Math.round(totalSpent / completed) : 0;

    return (
      <div className="modern-dashboard page-refresh-enter">
        <div className="dashboard-container">
          {/* Header Section */}
          <div className="dashboard-header profile-card-animate">
            <div className="user-welcome">
              <div className="user-avatar user">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h1>Welcome back, {name}!</h1>
                <p className="user-subtitle">Manage your service bookings</p>
              </div>
            </div>
            <div className="header-actions">
              <Link to="/search" className="action-btn primary btn-animate">
                <span className="btn-icon"><FaSearch /></span>
                Find Services
              </Link>
              <Link to="/edit-profile" className="action-btn secondary btn-animate">
                <span className="btn-icon"><FaCog /></span>
                Settings
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid animate-on-scroll stagger-animate">
            <div className="stat-card spending card-hover">
              <div className="stat-icon"><FaCreditCard /></div>
              <div className="stat-content">
                <h3>₹{totalSpent.toLocaleString()}</h3>
                <p>Total Spent</p>
              </div>
              <div className="stat-trend">All time</div>
            </div>
            <div className="stat-card monthly card-hover">
              <div className="stat-icon"><FaChartBar /></div>
              <div className="stat-content">
                <h3>₹{thisMonthSpent.toLocaleString()}</h3>
                <p>This Month</p>
              </div>
              <div className="stat-badge">{thisMonthBookings.length} bookings</div>
            </div>
            <div className="stat-card completed card-hover">
              <div className="stat-icon"><FaCheckCircle /></div>
              <div className="stat-content">
                <h3>{completed}</h3>
                <p>Completed</p>
              </div>
              <div className="stat-trend">₹{avgBookingValue} avg</div>
            </div>
            <div className="stat-card upcoming card-hover">
              <div className="stat-icon"><FaCalendarAlt /></div>
              <div className="stat-content">
                <h3>{upcoming}</h3>
                <p>Upcoming</p>
              </div>
              <div className="stat-badge">{upcoming > 0 ? 'Active' : 'None'}</div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="content-grid animate-on-scroll">
            {/* Recent Bookings */}
            <div className="content-card card-animate">
              <div className="card-header">
                <h2>Recent Bookings</h2>
                <Link to="/my-bookings" className="view-all btn-animate">View All</Link>
              </div>
              <div className="activity-list">
                {recentActivity.length > 0 ? recentActivity.map((booking, index) => (
                  <div key={booking._id || index} className="activity-item">
                    <div className={`activity-status ${booking.status}`}></div>
                    <div className="activity-content">
                      <h4>{booking.service}</h4>
                      <p>{booking.technician?.user?.name || 'Technician'}</p>
                      <span className="activity-time">
                        {booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'No date'}
                      </span>
                    </div>
                    <div className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </div>
                  </div>
                )) : (
                  <div className="empty-state">
                    <span className="empty-icon"><FaBoxOpen /></span>
                    <p>No bookings yet</p>
                    <Link to="/search" className="empty-action">Find Services</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Spending & Stats */}
            <div className="content-card card-animate">
              <div className="card-header">
                <h2>Spending Overview</h2>
              </div>
              <div className="performance-metrics">
                <div className="metric">
                  <div className="metric-label"><FaMoneyBillWave style={{ marginRight: '6px' }} /> Total Spent</div>
                  <div className="metric-value">₹{totalSpent.toLocaleString()}</div>
                </div>
                <div className="metric">
                  <div className="metric-label"><FaChartLine style={{ marginRight: '6px' }} /> This Month</div>
                  <div className="metric-value">₹{thisMonthSpent.toLocaleString()}</div>
                </div>
                <div className="metric">
                  <div className="metric-label"><FaChartBar style={{ marginRight: '6px' }} /> Avg Booking</div>
                  <div className="metric-value">₹{avgBookingValue}</div>
                </div>
                <div className="metric">
                  <div className="metric-label"><FaBullseye style={{ marginRight: '6px' }} /> Success Rate</div>
                  <div className="metric-value">{totalBookings > 0 ? Math.round((completed / totalBookings) * 100) : 0}%</div>
                </div>
                <div className="quick-actions-mini">
                  <Link to="/search" className="mini-action">
                    <FaSearch style={{ marginRight: '4px' }} /> Find Services
                  </Link>
                  <Link to="/my-bookings" className="mini-action">
                    <FaClipboardList style={{ marginRight: '4px' }} /> All Bookings
                  </Link>
                </div>
              </div>
            </div>
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
      </div>
    </div>
  );
};

export default Dashboard;
