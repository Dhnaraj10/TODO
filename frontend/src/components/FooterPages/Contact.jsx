import React, { useState } from 'react';
import './FooterPages.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="footer-page-container">
      <div className="footer-page-content">
        <h1>Contact Us</h1>
        <p className="last-updated">We'd love to hear from you! Reach out with any questions or feedback.</p>
        
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>
              Have questions about TODO App? We're here to help! Feel free to reach out to us through 
              any of the following channels:
            </p>
            
            <div className="contact-method">
              <h3>Email</h3>
              <p><a href="mailto:support@todoapp.com">support@todoapp.com</a></p>
              <p>For general inquiries and support</p>
            </div>
            
            <div className="contact-method">
              <h3>Feedback</h3>
              <p>We value your feedback and suggestions to improve our service.</p>
            </div>
            
            <div className="contact-method">
              <h3>Technical Support</h3>
              <p>For technical issues, please include details about the problem you're experiencing.</p>
            </div>
          </div>
          
          <div className="contact-form">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;