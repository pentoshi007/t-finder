import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Search.css';
import AuthContext from '../context/AuthContext';

const Search = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    // Removed unused state variables
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        location: searchParams.get('location') || '',
        minRate: '',
        maxRate: '',
        rating: '',
        sortBy: 'rating'
    });

    // Removed unused locations

    const { user } = useContext(AuthContext);
    const isTechnician = user && user.user && user.technician;

    // Add full categories and cities lists
    const ALL_CATEGORIES = [
        'Plumber', 'Electrician', 'Carpenter', 'Painter', 'AC Technician', 'Appliance Repair', 'Pest Control', 'Home Cleaning', 'Mobile Repair', 'Laptop Repair', 'Car Mechanic', 'Bike Mechanic', 'RO Water Purifier', 'CCTV Installation', 'Home Automation', 'Welder', 'Mason', 'Interior Designer'
    ];
    const ALL_CITIES = [
        'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Sambalpur', 'Bengaluru', 'Prayagraj', 'Hubli–Dharwad', 'Tiruchirappalli', 'Tiruppur', 'Moradabad', 'Mysore', 'Bareilly', 'Gurgaon', 'Aligarh', 'Jalandhar', 'Bhubaneswar', 'Salem', 'Mira-Bhayandar', 'Warangal', 'Thiruvananthapuram', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Nanded', 'Kolhapur', 'Ajmer', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Rampur', 'Shivamogga', 'Chandrapur', 'Junagadh', 'Thrissur', 'Alwar', 'Bardhaman', 'Kulti', 'Kakinada', 'Nizamabad', 'Parbhani', 'Tumkur', 'Khammam', 'Ozhukarai', 'Bihar Sharif', 'Panipat', 'Darbhanga', 'Bally', 'Aizawl', 'Dewas', 'Ichalkaranji', 'Karnal', 'Bathinda', 'Jalna', 'Eluru', 'Kirari Suleman Nagar', 'Barasat', 'Purnia', 'Satna', 'Mau', 'Sonipat', 'Farrukhabad', 'Sagar', 'Rourkela', 'Durg', 'Imphal', 'Ratlam', 'Hapur', 'Arrah', 'Karimnagar', 'Anantapur', 'Etawah', 'Ambarnath', 'North Dumdum', 'Bharatpur', 'Begusarai', 'New Delhi', 'Gandhidham', 'Baranagar', 'Tiruvottiyur', 'Puducherry', 'Sikar', 'Thoothukudi', 'Rewa', 'Mirzapur', 'Raichur', 'Pali', 'Ramagundam', 'Haridwar', 'Vijayanagaram', 'Katihar', 'Nagercoil', 'Sri Ganganagar', 'Karawal Nagar', 'Mango', 'Thanjavur', 'Bulandshahr', 'Uluberia', 'Murwara', 'Sambhal', 'Singrauli', 'Nadiad', 'Secunderabad', 'Naihati', 'Yamunanagar', 'Bidhan Nagar', 'Pallavaram', 'Bidar', 'Munger', 'Panchkula', 'Burhanpur', 'Raurkela Industrial Township', 'Kharagpur', 'Dindigul', 'Gandhinagar', 'Hospet', 'Nangloi Jat', 'Malda', 'Shimla', 'Adoni', 'Tenali', 'Proddatur', 'Saharsa', 'Hindupur', 'Sasaram', 'Hajipur', 'Beed', 'Bhimavaram', 'Dehri', 'Madanapalle', 'Siwan', 'Bettiah', 'Gondia', 'Guntakal', 'Srikakulam', 'Motihari', 'Dharmavaram', 'Satara', 'Barshi', 'Gudivada', 'Yavatmal', 'Narasaraopet', 'Bagaha', 'Achalpur', 'Osmanabad', 'Nandurbar', 'Miryalaguda', 'Tadipatri', 'Kishanganj', 'Wardha', 'Karaikudi', 'Suryapet', 'Jamalpur', 'Kavali', 'Tadepalligudem', 'Udgir', 'Amaravati', 'Buxar', 'Jehanabad', 'Hinganghat', 'Aurangabad'
    ];

    // Restore categories and locations state
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);

    // Add state for pagination and search
    const [displayedTechnicians, setDisplayedTechnicians] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const PAGE_SIZE = 12;
    const LOAD_MORE_SIZE = 6;

    // Helper to check if any filter/search is active
    const isFilterActive = !!(filters.category || filters.location || filters.minRate || filters.maxRate || filters.rating || (filters.citySearch && filters.citySearch.trim() !== ''));

    // In useEffect, always call fetchTechnicians(true) with reset=true when filters change
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        fetchCategories();
        fetchLocations();
    }, []);

    // Fetch technicians when meaningful filters change (exclude citySearch)
    useEffect(() => {
        fetchTechnicians(true); // Always reset when filters change
    }, [filters.category, filters.location, filters.minRate, filters.maxRate, filters.rating, filters.sortBy]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/categories');
            setCategories(res.data.map(cat => cat.name));
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };
    const fetchLocations = async () => {
        try {
            const res = await axios.get('/api/cities');
            setLocations(res.data);
        } catch {
            setLocations([]);
        }
    };

    // Update fetchTechnicians to handle filter vs. default
    const fetchTechnicians = async (reset = false, filtersOverride = null) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            const filtersToUse = filtersOverride || filters;

            // Check if any filter is active using the filters we're actually using
            const isCurrentlyFilterActive = !!(filtersToUse.category || filtersToUse.location || filtersToUse.minRate || filtersToUse.maxRate || filtersToUse.rating);

            if (filtersToUse.category) params.append('category', filtersToUse.category);
            if (filtersToUse.location) params.append('location', filtersToUse.location);
            if (filtersToUse.minRate) params.append('minRate', filtersToUse.minRate);
            if (filtersToUse.maxRate) params.append('maxRate', filtersToUse.maxRate);
            if (filtersToUse.rating) params.append('rating', filtersToUse.rating);
            params.append('sortBy', filtersToUse.sortBy);

            if (!isCurrentlyFilterActive) {
                // Pagination for default view
                params.append('skip', reset ? 0 : displayedTechnicians.length);
                params.append('limit', reset ? PAGE_SIZE : LOAD_MORE_SIZE);
            }

            const res = await axios.get(`/api/technicians?${params.toString()}`);

            if (isCurrentlyFilterActive || reset) {
                setDisplayedTechnicians(res.data);
                setHasMore(!isCurrentlyFilterActive && res.data.length === PAGE_SIZE);
            } else {
                setDisplayedTechnicians(prev => [...prev, ...res.data]);
                setHasMore(res.data.length === LOAD_MORE_SIZE);
            }
        } catch (err) {
            console.error('Error fetching technicians:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        if (key === 'citySearch') {
            // Normalize input to Title Case for consistent comparison
            value = value.replace(/\b\w/g, c => c.toUpperCase());
            // If the typed value fully matches a city, automatically set location filter
            const matchedCity = locations.find(city => city.toLowerCase() === value.toLowerCase());
            if (matchedCity) {
                setFilters(prev => ({ ...prev, citySearch: value, location: matchedCity }));
                setShowSuggestions(false);
            } else {
                // Only update search text; keep existing location untouched to avoid refetch
                setFilters(prev => ({ ...prev, citySearch: value }));
                setShowSuggestions(true);
            }
            return;
        }
        if (key === 'location') {
            // When a city is selected from dropdown, keep citySearch in sync
            setFilters(prev => ({ ...prev, location: value, citySearch: value }));
            setShowSuggestions(false);
            return;
        }
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            location: '',
            minRate: '',
            maxRate: '',
            rating: '',
            sortBy: 'rating'
        });
    };

    if (isTechnician) {
        return (
            <div className="search-outer-container">
                <div className="search-header">
                    <h1>Find Technicians</h1>
                    <p>Technicians cannot search or book other technicians.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="search-outer-container">
            <div className="search-header">
                <h1>Find Technicians</h1>
                <p>Discover verified professionals in your area</p>
                {isFilterActive && (
                    <div className="results-count">{displayedTechnicians.length} Technicians Found</div>
                )}
            </div>
            <div className="search-content">
                <aside className="filters-sidebar">
                    {/* Filters Sidebar (unchanged) */}
                    <div className="filters-header">
                        <h3>Filters</h3>
                        <button onClick={clearFilters} className="clear-filters">Clear All</button>
                    </div>
                    {/* ...filter groups... */}
                    <div className="filter-group">
                        <label>Category</label>
                        <select
                            value={filters.category}
                            onChange={e => handleFilterChange('category', e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>City</label>
                        <div className="city-search-wrapper">
                            <input
                                type="text"
                                placeholder="Search city..."
                                value={filters.citySearch || ''}
                                onChange={e => handleFilterChange('citySearch', e.target.value)}

                                style={{ marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
                            />
                            {showSuggestions && filters.citySearch?.length >= 2 && (
                                <ul className="city-suggestions" ref={suggestionsRef}>
                                    {locations
                                        .filter(city =>
                                            filters.citySearch && filters.citySearch.length >= 2 && city.toLowerCase().startsWith(filters.citySearch.toLowerCase())
                                        )
                                        .map(city => (
                                            <li key={city} onClick={() => handleFilterChange('location', city)}>{city}</li>
                                        ))}
                                </ul>
                            )}
                            <select
                                value={filters.location}
                                onChange={e => handleFilterChange('location', e.target.value)}
                            >
                                <option value="">All Cities</option>
                                {locations
                                    .filter(city =>
                                        // Show suggestions only when at least 2 chars typed or no search filter
                                        !filters.citySearch ||
                                        (filters.citySearch.length >= 2 && city.toLowerCase().startsWith(filters.citySearch.toLowerCase()))
                                    )
                                    .map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    <div className="filter-group">
                        <label>Hourly Rate (₹)</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.minRate}
                                onChange={e => handleFilterChange('minRate', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.maxRate}
                                onChange={e => handleFilterChange('maxRate', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="filter-group">
                        <label>Minimum Rating</label>
                        <select
                            value={filters.rating}
                            onChange={e => handleFilterChange('rating', e.target.value)}
                        >
                            <option value="">Any Rating</option>
                            <option value="4">4+</option>
                            <option value="4.5">4.5+</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Sort By</label>
                        <select
                            value={filters.sortBy}
                            onChange={e => handleFilterChange('sortBy', e.target.value)}
                        >
                            <option value="rating">Highest Rated</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="experience">Most Experienced</option>
                        </select>
                    </div>
                </aside>
                <section className="results-section">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading technicians...</p>
                        </div>
                    ) : displayedTechnicians.length > 0 ? (
                        <>
                            <div className="technicians-grid">
                                {displayedTechnicians.map((tech) => (
                                    <div
                                        key={tech._id}
                                        className="technician-card"
                                        onClick={() => navigate(`/technician/${tech._id}`)}
                                    >
                                        {/* ...card content... */}
                                        <div className="tech-header">
                                            <div className="tech-avatar">
                                                {tech.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="tech-info">
                                                <h3 className="tech-name">{tech.user.name}</h3>
                                                <p className="tech-category">{tech.category.name}</p>
                                                <p className="tech-location">📍 {tech.location.city}</p>
                                            </div>
                                        </div>
                                        <div className="tech-rating">
                                            <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                                            <span className="rating-text">{tech.averageRating || '4.8'}</span>
                                        </div>
                                        <div className="tech-experience">
                                            {tech.experience} years experience
                                        </div>
                                        <div className="tech-skills">
                                            {tech.skills && tech.skills.map((skill, idx) => (
                                                <span key={idx} className="skill-tag">{skill}</span>
                                            ))}
                                        </div>
                                        <div className="tech-bio">
                                            {tech.bio && tech.bio.length > 100 ? tech.bio.slice(0, 100) + '...' : tech.bio}
                                        </div>
                                        <div className="tech-footer">
                                            <div className="tech-rate">
                                                <span className="rate-amount">₹{tech.hourlyRate}</span>
                                                <span className="rate-unit">/hour</span>
                                            </div>
                                            <button className="book-now-btn">View Profile & Book</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {!isFilterActive && hasMore && (
                                <div className="load-more-container">
                                    <button
                                        className="load-more-btn"
                                        onClick={() => fetchTechnicians(false)}
                                        disabled={loading}
                                    >
                                        {loading ? 'Loading...' : 'Load More Technicians'}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="no-results">
                            <div className="no-results-icon">🔍</div>
                            <h3>No technicians found</h3>
                            <p>Try adjusting your filters or search criteria</p>
                            <button onClick={clearFilters} className="reset-search-btn">
                                Reset Search
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Search;