import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Register.css';
import './Page.css';

const Register = () => {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    category: '',
    city: '',
    state: '',
    bio: '',
    skills: '',
    experience: '',
    hourlyRate: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlRole = params.get('role');
    if (urlRole === 'technician') {
      setRole('technician');
    }
  }, [location.search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
        if (res.data.length > 0) {
          // Set a default category for the form state
          setFormData(prev => ({ ...prev, category: res.data[0]._id }));
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
        toast.error('Could not load technician categories from the server.');
        setError('Could not load technician categories from the server.');
      }
    };
    fetchCategories();
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const submissionData = { ...formData, role };
      // The endpoint is now the same for both users and technicians
      const res = await axios.post('/api/users/register', submissionData);

      // Assuming the backend returns a token
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;

      toast.success('Registration successful! Welcome.');
      navigate('/'); // Redirect to home or dashboard after successful registration
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
      console.error(err.response?.data);
    }
  };

  return (
    <div className="page-container">
      <div className="content-card card-animate">
        <h2>Create Your Account</h2>
        <form onSubmit={onSubmit}>
          <div className="role-selector">
            <div
              className={`role-box ${role === 'user' ? 'selected' : ''}`}
              onClick={() => setRole('user')}
            >
              <h4>I'm a User</h4>
            </div>
            <div
              className={`role-box ${role === 'technician' ? 'selected' : ''}`}
              onClick={() => setRole('technician')}
            >
              <h4>I'm a Technician</h4>
            </div>
          </div>

          {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={onChange} minLength="6" required />
          </div>

          {role === 'technician' && (
            <>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={onChange} required>
                  <option value="" disabled>-- Select a Category --</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Skills (comma-separated)</label>
                <input type="text" name="skills" value={formData.skills} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" value={formData.bio} onChange={onChange} required></textarea>
              </div>
              <div className="form-group">
                <label>Years of Experience</label>
                <input type="number" name="experience" value={formData.experience} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Hourly Rate (INR)</label>
                <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={onChange} required />
              </div>
            </>
          )}

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;