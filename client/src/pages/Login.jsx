import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Page.css';

const Login = () => {
  const { login, isAuthenticated, user, loading: authLoading } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Handle redirection when user is already authenticated
  useEffect(() => {
    console.log('Login redirect check:', { isAuthenticated, user, authLoading });
    if (isAuthenticated && user && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await login(formData);
      // The useEffect will handle the redirection when isAuthenticated and user are set
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="glass-container content-card">
        <h2>Login</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              disabled={isSubmitting || authLoading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              minLength="6"
              required
              disabled={isSubmitting || authLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || authLoading}
            className={isSubmitting || authLoading ? 'loading' : ''}
          >
            {isSubmitting || authLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
