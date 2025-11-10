import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <h3 className="footer-logo">TODO</h3>
        <p className="footer-tagline">
          Simplify your tasks. Amplify your productivity.
        </p>
        <div className="footer-links">
          <Link to="/about" className="footer-link-button">About Us</Link>
          <Link to="/privacy" className="footer-link-button">Privacy</Link>
          <Link to="/terms" className="footer-link-button">Terms</Link>
          <Link to="/contact" className="footer-link-button">Contact</Link>
        </div>
        <p className="footer-credit">
          © {new Date().getFullYear()} TODO App. Built with 💻 by Dhanraj Singh.
        </p>
      </div>
    </footer>
  );
};

export default Footer;