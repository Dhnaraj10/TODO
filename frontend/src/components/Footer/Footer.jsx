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
          <button className="footer-link-button" onClick={() => {}}>About Us</button>
          <button className="footer-link-button" onClick={() => {}}>Privacy</button>
          <button className="footer-link-button" onClick={() => {}}>Terms</button>
          <button className="footer-link-button" onClick={() => {}}>Contact</button>
        </div>
        <p className="footer-credit">
          © {new Date().getFullYear()} TODO App. Built with 💻 by Dhanraj Singh.
        </p>
      </div>
    </footer>
  );
};

export default Footer;