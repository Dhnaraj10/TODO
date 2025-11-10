import React from 'react';
import './FooterPages.css';

const Terms = () => {
  return (
    <div className="footer-page-container">
      <div className="footer-page-content">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section className="policy-section">
          <h2>Introduction</h2>
          <p>
            Welcome to TODO App. These Terms of Service ("Terms") govern your access to and use of our 
            application and services. By accessing or using our services, you agree to be bound by these Terms.
          </p>
        </section>

        <section className="policy-section">
          <h2>Eligibility</h2>
          <p>
            You must be at least 13 years old to use our services. By agreeing to these Terms, you represent 
            and warrant that you meet this eligibility requirement.
          </p>
        </section>

        <section className="policy-section">
          <h2>Account Registration</h2>
          <p>
            To use certain features of our services, you may be required to create an account. You agree to:
          </p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain and update your information as needed</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>User Responsibilities</h2>
          <p>You are responsible for your use of our services and any content you provide. You agree not to:</p>
          <ul>
            <li>Use our services for any illegal purpose</li>
            <li>Interfere with or disrupt the integrity or performance of our services</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use our services to transmit viruses or malicious code</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Intellectual Property</h2>
          <p>
            The services and all materials contained therein, including, without limitation, the TODO App 
            logo, text, graphics, logos, button icons, images, audio clips, digital downloads, data 
            compilations, and software, are the property of TODO App or its licensors and protected by 
            international copyright laws.
          </p>
        </section>

        <section className="policy-section">
          <h2>Disclaimer of Warranties</h2>
          <p>
            Our services are provided "as is" and "as available" without warranties of any kind, either 
            express or implied. TODO App disclaims all warranties, including, but not limited to, 
            implied warranties of merchantability and fitness for a particular purpose.
          </p>
        </section>

        <section className="policy-section">
          <h2>Limitation of Liability</h2>
          <p>
            In no event shall TODO App be liable for any indirect, incidental, special, consequential, 
            or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
            or other intangible losses, resulting from your access to or use of or inability to access 
            or use the services.
          </p>
        </section>

        <section className="policy-section">
          <h2>Changes to These Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
            We will provide notice of any significant changes by updating the "Last Updated" date at 
            the top of this page.
          </p>
        </section>

        <section className="policy-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at: 
            <a href="mailto:support@todoapp.com"> support@todoapp.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;