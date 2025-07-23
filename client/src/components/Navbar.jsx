import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  let displayName = '';
  let avatarLetter = '';
  if (user) {
    if (user.user && user.technician) {
      displayName = user.user.name;
      avatarLetter = user.user.name.charAt(0).toUpperCase();
    } else {
      displayName = user.name;
      avatarLetter = user.name.charAt(0).toUpperCase();
    }
  }

  const isTechnician = user && user.user && user.technician;
  const isUser = user && !user.user;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const technicianDropdown = (
    <div className="navbar-dropdown" ref={dropdownRef}>
      <div className="navbar-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <span>{avatarLetter}</span>
        <span className="navbar-name">{displayName}</span>
        {/* No role text here */}
        <span className="navbar-caret">▼</span>
      </div>
      {dropdownOpen && (
        <ul className="navbar-dropdown-menu">
          <li><NavLink to="/dashboard" onClick={() => setDropdownOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
          <li><NavLink to="/jobs" onClick={() => setDropdownOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>My Jobs</NavLink></li>
          <li><a onClick={() => { setDropdownOpen(false); logout(); }} href="#!">Logout</a></li>
        </ul>
      )}
    </div>
  );

  // User dropdown for logged-in users
  const userDropdown = (
    <div className="navbar-dropdown" ref={dropdownRef}>
      <div className="navbar-avatar user" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <span>{avatarLetter}</span>
        <span className="navbar-name">{displayName}</span>
        <span className="navbar-caret">▼</span>
      </div>
      {dropdownOpen && (
        <ul className="navbar-dropdown-menu">
          <li><NavLink to="/dashboard" onClick={() => setDropdownOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
          <li><NavLink to="/my-bookings" onClick={() => setDropdownOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>My Bookings</NavLink></li>
          <li><NavLink to="/edit-profile" onClick={() => setDropdownOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Edit Profile</NavLink></li>
          <li><a onClick={() => { setDropdownOpen(false); logout(); }} href="#!">Logout</a></li>
        </ul>
      )}
    </div>
  );

  const authLinks = (
    <ul className="navbar-links">
      <li><NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink></li>
      {isUser && <li><NavLink to="/search" className={({isActive}) => isActive ? 'active' : ''}>Find Technicians</NavLink></li>}
      {isTechnician && technicianDropdown}
      {isUser && userDropdown}
    </ul>
  );

  const guestLinks = (
    <ul className="navbar-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/register">Register</Link></li>
    </ul>
  );

  return (
    <nav className="navbar glass-container">
      <div className="navbar-brand">
        <Link to="/">T-Finder</Link>
      </div>
      <>{isAuthenticated ? authLinks : guestLinks}</>
    </nav>
  );
};

export default Navbar;
