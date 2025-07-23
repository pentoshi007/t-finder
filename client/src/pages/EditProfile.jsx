import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import './Page.css';

const EditProfile = () => {
  const { user, loadUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const { name, email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/users/profile', formData);
      loadUser(); // Reload user data to reflect changes
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Failed to update profile.';
      toast.error(errorMessage);
      console.error(err.response?.data);
    }
  };

  return (
    <div className="page-container">
      <div className="glass-container content-card">
        <h2>Edit Profile</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
