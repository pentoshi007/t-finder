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
  FaWrench,
  FaPaintRoller,
  FaSnowflake,
  FaMobileAlt,
  FaPlug,
  FaCar
} from 'react-icons/fa';
import './Home.css';
import AuthContext from '../context/AuthContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import TechnicianCard from '../components/TechnicianCard';

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
          <div className="hero-text-center">
            <h1 className="hero-title">
              Find <span className="highlight">Trusted Local Technicians</span>
              <br />for Every Need
            </h1>
            <p className="hero-subtitle">
              Connect with verified professionals for home repairs, installations, and maintenance.
              Book instantly with transparent pricing and real reviews.
            </p>

            {/* Search Bar */}
            {!isTechnician && (
              <div className="hero-search-centered">
                <div className="search-container">
                  <div className="search-inputs-wrapper">
                    <div className="search-input-group">
                      <FaWrench className="input-icon" />
                      <select
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-select clean-select"
                      >
                        <option value="">What service do you need?</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="search-divider"></div>

                    <div className="search-input-group">
                      <FaSearch className="input-icon" />
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="search-select clean-select"
                      >
                        <option value="">Where?</option>
                        {locations.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button onClick={handleSearch} className="search-button solid-btn">
                    Find Technicians
                  </button>
                </div>
              </div>
            )}

            {!isTechnician && (
              <div className="hero-actions-centered">
                <Link to="/register" className="hero-cta-primary solid-btn">Get Started</Link>
                <Link to="/register?role=technician" className="hero-cta-secondary outline-btn">Join as Technician</Link>
              </div>
            )}
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
                {category.name === 'Plumber' && <FaWrench />}
                {category.name === 'Electrician' && <FaBolt />}
                {category.name === 'Carpenter' && <FaHammer />}
                {category.name === 'Painter' && <FaPaintRoller />}
                {category.name === 'AC Repair' && <FaSnowflake />}
                {category.name === 'Mobile Repair' && <FaMobileAlt />}
                {category.name === 'Appliance Repair' && <FaPlug />}
                {category.name === 'Car Mechanic' && <FaCar />}
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
            <TechnicianCard key={tech._id} technician={tech} />
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
            <div className="testimonial-rating">{[...Array(5)].map((_, i) => <FaStar key={i} />)}</div>
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
            <div className="testimonial-rating">{[...Array(5)].map((_, i) => <FaStar key={i} />)}</div>
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
            <div className="testimonial-rating">{[...Array(5)].map((_, i) => <FaStar key={i} />)}</div>
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
