import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaBolt,
  FaCalendarAlt,
  FaCheckCircle,
  FaHammer,
  FaMoneyBillWave,
  FaSearch,
  FaShieldAlt,
  FaStar,
  FaWrench
} from 'react-icons/fa';
import './Home.css';
import AuthContext from '../context/AuthContext';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [featuredTechnicians, setFeaturedTechnicians] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isTechnician = user && user.user && user.technician;
  const [locations, setLocations] = useState([]);

  // Initialize scroll animations
  useScrollAnimation();

  useEffect(() => {
    fetchCategories();
    fetchFeaturedTechnicians();
    fetchCities();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchFeaturedTechnicians = async () => {
    try {
      const res = await axios.get('/api/technicians?limit=6');
      setFeaturedTechnicians(res.data);
    } catch (err) {
      console.error('Error fetching technicians:', err);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await axios.get('/api/cities');
      setLocations(res.data);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('category', searchQuery);
    if (selectedLocation) params.append('location', selectedLocation);
    navigate(`/search?${params.toString()}`);
  };

  const stats = [
    { number: '2400+', label: 'Verified Technicians' },
    { number: '50+', label: 'Cities Covered' },
    { number: '8', label: 'Service Categories' },
    { number: '4.8/5', label: 'Average Rating' }
  ];

  return (
    <div className="home-container home-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Find <span className="highlight">Trusted Local Technicians</span> for Every Need
            </h1>
            <p className="hero-subtitle">
              Connect with verified professionals for home repairs, installations, and maintenance.
              Book instantly with transparent pricing and real reviews.
            </p>

            {/* Search Bar */}
            {!isTechnician && (
              <div className="hero-search">
                <div className="search-container">
                  <div className="search-row">
                    <select
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-select"
                    >
                      <option value="">Select a service...</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>

                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="search-select"
                    >
                      <option value="">Choose a location...</option>
                      {locations.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <button onClick={handleSearch} className="search-button">
                    Find Technicians
                  </button>
                </div>
              </div>
            )}

            {!isTechnician && (
              <div className="hero-actions">
                <Link to="/register" className="hero-cta-primary">Get Started</Link>
                <Link to="/register?role=technician" className="hero-cta-secondary">Join as Technician</Link>
              </div>
            )}
          </div>

          <div className="hero-image">
            <div className="hero-card">
              <div className="service-preview">
                <h3>Quick Service Booking</h3>
                <div className="service-item">
                  <span className="service-icon"><FaWrench /></span>
                  <span>Plumber - Available Now</span>
                  <span className="service-rating"><FaStar /> 4.9</span>
                </div>
                <div className="service-item">
                  <span className="service-icon"><FaBolt /></span>
                  <span>Electrician - 2 hrs away</span>
                  <span className="service-rating"><FaStar /> 4.8</span>
                </div>
                <div className="service-item">
                  <span className="service-icon"><FaHammer /></span>
                  <span>Carpenter - Book for tomorrow</span>
                  <span className="service-rating"><FaStar /> 4.7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats-section animate-on-scroll">
        <div className="stats-container stagger-animate">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <h3 className="stat-number">{stat.number}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section animate-on-scroll">
        <h2 className="section-title">How T-Finder Works</h2>
        <div className="steps-container stagger-animate">
          <div className="step">
            <div className="step-icon"><FaSearch /></div>
            <h3>Search & Compare</h3>
            <p>Browse verified technicians by category, location, and ratings. Compare prices and reviews.</p>
          </div>
          <div className="step">
            <div className="step-icon"><FaCalendarAlt /></div>
            <h3>Book Instantly</h3>
            <p>Choose available time slots and book your service with transparent pricing.</p>
          </div>
          <div className="step">
            <div className="step-icon"><FaCheckCircle /></div>
            <h3>Get It Done</h3>
            <p>Professional service delivered on time. Rate and review after completion.</p>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories-section animate-on-scroll">
        <h2 className="section-title">Popular Services</h2>
        <div className="categories-grid stagger-animate">
          {categories.slice(0, 8).map((category) => (
            <div key={category._id} className="category-card card-hover" onClick={() => navigate(`/search?category=${category.name}`)}>
              <div className="category-icon">
                {category.name === 'Plumber' && '🔧'}
                {category.name === 'Electrician' && '⚡'}
                {category.name === 'Carpenter' && '🔨'}
                {category.name === 'Painter' && '🎨'}
                {category.name === 'AC Repair' && '❄️'}
                {category.name === 'Mobile Repair' && '📱'}
                {category.name === 'Appliance Repair' && '🔌'}
                {category.name === 'Car Mechanic' && '🚗'}
              </div>
              <div className="category-name">{category.name}</div>
              <div className="category-desc">Professional {category.name.toLowerCase()} services</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Technicians */}
      <section className="featured-technicians-section animate-on-scroll">
        <h2 className="section-title">Top Rated Technicians</h2>
        <div className="technicians-grid stagger-animate">
          {featuredTechnicians.map((tech) => (
            <div key={tech._id} className="technician-card card-hover" onClick={() => navigate(`/technician/${tech._id}`)}>
              <div className="tech-avatar">
                {tech.user.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="tech-name">{tech.user.name}</h3>
              <p className="tech-category">{tech.category.name}</p>
              <p className="tech-location">📍 {tech.location.city}</p>
              <div className="tech-rating">
                <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                <span className="rating-text">{tech.averageRating || '4.8'}</span>
              </div>
              <p className="tech-rate">₹{tech.hourlyRate}/hr</p>
            </div>
          ))}
        </div>
        <div className="section-cta animate-on-scroll delay-2">
          <Link to="/search" className="view-all-btn">View All Technicians</Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us-section animate-on-scroll">
        <h2 className="section-title">Why Choose T-Finder?</h2>
        <div className="features-container stagger-animate">
          <div className="feature-item">
            <div className="feature-icon"><FaCheckCircle /></div>
            <h3>Verified Professionals</h3>
            <p>Every technician is background-checked, verified, and rated by real customers.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><FaMoneyBillWave /></div>
            <h3>Transparent Pricing</h3>
            <p>See upfront pricing with no hidden fees. Compare rates and choose what works for you.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><FaBolt /></div>
            <h3>Instant Booking</h3>
            <p>Book services instantly with real-time availability and flexible scheduling.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><FaShieldAlt /></div>
            <h3>Service Guarantee</h3>
            <p>All services come with quality guarantee and customer support.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section animate-on-scroll">
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="testimonials-container stagger-animate">
          <div className="testimonial-card card-hover">
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p>"Found an excellent plumber through T-Finder. Quick response, fair pricing, and quality work. Highly recommended!"</p>
            <div className="testimonial-author">
              <div className="author-avatar">P</div>
              <div>
                <h4>Priya Sharma</h4>
                <span>Mumbai</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card card-hover">
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p>"The electrician was professional, punctual, and solved my issue quickly. The booking process was seamless!"</p>
            <div className="testimonial-author">
              <div className="author-avatar">R</div>
              <div>
                <h4>Rohan Mehta</h4>
                <span>Delhi</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card card-hover">
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p>"Great platform! Found a reliable AC technician who fixed my unit perfectly. Will definitely use again."</p>
            <div className="testimonial-author">
              <div className="author-avatar">A</div>
              <div>
                <h4>Anita Patel</h4>
                <span>Bangalore</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section animate-on-scroll">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied customers who trust T-Finder for their service needs</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-primary btn-animate">Find Technicians</Link>
            <Link to="/register" className="cta-secondary btn-animate">Become a Technician</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
