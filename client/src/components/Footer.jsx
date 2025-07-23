import React from 'react';
import './Footer.css';
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer glass-footer">
      <div className="footer-main-col">
        <span className="footer-built">Built by Aniket</span>
        <span className="footer-socials">
          <a href="https://github.com/pentoshi007" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
          <a href="https://www.linkedin.com/in/aniket00736/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="https://x.com/lunatic_ak_" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><FaTwitter /></a>
          <a href="#" aria-label="Web"><FaGlobe /></a>
        </span>
      </div>
      <div className="footer-divider" />
      <div className="footer-copyright">
        <span>&copy; {new Date().getFullYear()} T-Finder.</span>
      </div>
    </footer>
  );
};

export default Footer;
