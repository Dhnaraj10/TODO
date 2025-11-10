import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <h3 className="footer-logo">TODO</h3>
        <p className="footer-tagline">
          Simplify your tasks. Amplify your productivity.
        </p>
        <div className="footer-links">
          <a href="javascript:void(0)">About Us</a>
          <a href="javascript:void(0)">Privacy</a>
          <a href="javascript:void(0)">Terms</a>
          <a href="javascript:void(0)">Contact</a>
        </div>
        <p className="footer-credit">
          © {new Date().getFullYear()} TODO App. Built with 💻 by Dhanraj Singh.
        </p>
      </div>
    </footer>
  );
};

export default Footer;