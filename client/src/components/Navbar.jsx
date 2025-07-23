import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

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
  const isUser = user && user.role === 'user' && !user.user;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
        !event.target.classList.contains('mobile-menu-toggle')) {
        setMobileMenuOpen(false);
        setDropdownOpen(false); // Close dropdown when mobile menu closes
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen, mobileMenuOpen]);

  // Close dropdown when mobile menu closes
  useEffect(() => {
    if (!mobileMenuOpen) {
      setDropdownOpen(false);
    }
  }, [mobileMenuOpen]);

  // Handle body scroll lock for mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileMenuOpen]);

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
          <li><NavLink to="/dashboard" onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }} className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
          <li><NavLink to="/jobs" onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }} className={({ isActive }) => isActive ? 'active' : ''}>My Jobs</NavLink></li>
          <li><a onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); logout(); }} href="#!">Logout</a></li>
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
          <li><NavLink to="/dashboard" onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }} className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
          <li><NavLink to="/my-bookings" onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }} className={({ isActive }) => isActive ? 'active' : ''}>My Bookings</NavLink></li>
          <li><NavLink to="/edit-profile" onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }} className={({ isActive }) => isActive ? 'active' : ''}>Edit Profile</NavLink></li>
          <li><a onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); logout(); }} href="#!">Logout</a></li>
        </ul>
      )}
    </div>
  );

  const authLinks = (
    <ul className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`} ref={mobileMenuRef}>
      <li><NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
      {isUser && <li><NavLink to="/search" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>Find Technicians</NavLink></li>}

      {/* Desktop: Show dropdowns, Mobile: Show direct links */}
      <li className="desktop-only">
        {isTechnician && technicianDropdown}
        {isUser && userDropdown}
      </li>

      {/* Mobile: Show direct menu items instead of dropdowns */}
      {isTechnician && (
        <>
          <li className="mobile-only user-info">
            <div className="mobile-user-header">
              <span className="mobile-avatar">{avatarLetter}</span>
              <span className="mobile-name">{displayName}</span>
            </div>
          </li>
          <li className="mobile-only"><NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
          <li className="mobile-only"><NavLink to="/jobs" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>My Jobs</NavLink></li>
          <li className="mobile-only"><a onClick={() => { setMobileMenuOpen(false); logout(); }} href="#!">Logout</a></li>
        </>
      )}

      {isUser && (
        <>
          <li className="mobile-only user-info">
            <div className="mobile-user-header">
              <span className="mobile-avatar user">{avatarLetter}</span>
              <span className="mobile-name">{displayName}</span>
            </div>
          </li>
          <li className="mobile-only"><NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
          <li className="mobile-only"><NavLink to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>My Bookings</NavLink></li>
          <li className="mobile-only"><NavLink to="/edit-profile" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>Edit Profile</NavLink></li>
          <li className="mobile-only"><a onClick={() => { setMobileMenuOpen(false); logout(); }} href="#!">Logout</a></li>
        </>
      )}
    </ul>
  );

  const guestLinks = (
    <ul className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`} ref={mobileMenuRef}>
      <li><NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink></li>
      <li><NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>Login</NavLink></li>
      <li><NavLink to="/register" onClick={() => setMobileMenuOpen(false)}>Register</NavLink></li>
    </ul>
  );

  return (
    <nav className="navbar glass-container">
      <div className="navbar-brand">
        <Link to="/">T-Finder</Link>
      </div>
      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>
      <>{isAuthenticated ? authLinks : guestLinks}</>
    </nav>
  );
};

export default Navbar;
