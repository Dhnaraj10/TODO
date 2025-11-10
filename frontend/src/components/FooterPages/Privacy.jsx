import React from 'react';
import './FooterPages.css';

const Privacy = () => {
  return (
    <div className="footer-page-container">
      <div className="footer-page-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section className="policy-section">
          <h2>Introduction</h2>
          <p>
            At TODO App, we respect your privacy and are committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you use our application.
          </p>
        </section>

        <section className="policy-section">
          <h2>Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>
            We may collect personally identifiable information that you voluntarily provide to us when 
            you register or use our application, including:
          </p>
          <ul>
            <li>Email address</li>
            <li>Username</li>
            <li>Password (securely encrypted)</li>
          </ul>

          <h3>Usage Data</h3>
          <p>
            We may also collect information automatically when you use the application:
          </p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Pages visited</li>
            <li>Time and date of visit</li>
            <li>Time spent on pages</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>How We Use Your Information</h2>
          <p>We use the collected information for various purposes:</p>
          <ul>
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To allow you to participate in interactive features</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information to improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent, and address technical issues</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Data Security</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission 
            over the Internet or method of electronic storage is 100% secure. While we strive to use 
            commercially acceptable means to protect your personal information, we cannot guarantee 
            its absolute security.
          </p>
        </section>

        <section className="policy-section">
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section className="policy-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at: 
            <a href="mailto:support@todoapp.com"> support@todoapp.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;