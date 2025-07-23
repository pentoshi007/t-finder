import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = async () => {
    if (localStorage.token) {
      axios.defaults.headers.common['x-auth-token'] = localStorage.token;
      console.log('AuthContext: Loading user with token:', localStorage.token);
      try {
        const res = await axios.get('/api/users/profile');
        console.log('AuthContext: User loaded:', res.data);
        dispatch({ type: 'USER_LOADED', payload: res.data });
        return res.data; // Return user data on success
      } catch (err) {
        console.error('AuthContext: Error loading user:', err.response?.data || err.message);
        dispatch({ type: 'AUTH_ERROR' });
        throw err; // Throw error so login function can handle it
      }
    } else {
      console.log('AuthContext: No token found, dispatching AUTH_ERROR');
      delete axios.defaults.headers.common['x-auth-token'];
      dispatch({ type: 'AUTH_ERROR' });
      return null; // Return null when no token
    }
  };

  useEffect(() => {
    loadUser().catch(() => {
      // Silently handle the error - user is just not authenticated
    });
  }, []);

  const login = async (formData) => {
    try {
      const res = await axios.post('/api/users/login', formData);
      localStorage.setItem('token', res.data.token); // Set token before dispatch
      console.log('AuthContext: Login success, token:', res.data.token);

      // Add login success animation to body
      document.body.classList.add('login-success-animation');
      setTimeout(() => {
        document.body.classList.remove('login-success-animation');
      }, 600);

      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      await loadUser(); // Await this to ensure user data is loaded before success toast
      toast.success('Logged in successfully!');
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
      const errorMessage = err.response?.data?.msg || 'Login failed. Please check your credentials or session may have expired.';
      toast.error(errorMessage);
      console.error('AuthContext: Login error:', err.response?.data || err.message);
      throw err; // Re-throw error to be caught in the component
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out, clearing token and user.');

    // Add logout animation to body
    document.body.classList.add('logout-animation');
    setTimeout(() => {
      document.body.classList.remove('logout-animation');
      dispatch({ type: 'LOGOUT' });
      toast('Logged out.');
    }, 400);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
