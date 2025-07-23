import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import PageAnimation from './components/PageAnimation';
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Technician from './pages/Technician';
import Jobs from './pages/Jobs';
import MyBookings from './pages/MyBookings';
import './App.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageAnimation><Home /></PageAnimation>} />
        <Route path="/search" element={<PageAnimation><Search /></PageAnimation>} />
        <Route path="/login" element={<PageAnimation><Login /></PageAnimation>} />
        <Route path="/register" element={<PageAnimation><Register /></PageAnimation>} />
        <Route path="/technician/:id" element={<PageAnimation><Technician /></PageAnimation>} />
        <Route
          path="/dashboard"
          element={<PrivateRoute><PageAnimation><Dashboard /></PageAnimation></PrivateRoute>}
        />
        <Route
          path="/edit-profile"
          element={<PrivateRoute><PageAnimation><EditProfile /></PageAnimation></PrivateRoute>}
        />
        <Route
          path="/jobs"
          element={<PrivateRoute><PageAnimation><Jobs /></PageAnimation></PrivateRoute>}
        />
        <Route
          path="/my-bookings"
          element={<PrivateRoute><PageAnimation><MyBookings /></PageAnimation></PrivateRoute>}
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  // Remove isLoading and loading screen logic
  return (
    <div className="app-container page-refresh-enter">
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
