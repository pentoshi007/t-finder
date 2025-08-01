import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ServerInfoPopup from './ServerInfoPopup';

const Layout = ({ children }) => {
  return (
    <div className="relative">
      <ServerInfoPopup />
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;