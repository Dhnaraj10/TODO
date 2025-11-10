import React from 'react';
import './FooterPages.css';

const About = () => {
  return (
    <div className="footer-page-container">
      <div className="footer-page-content">
        <h1>About TODO App</h1>
        <p className="last-updated">Simplifying task management for everyone</p>
        
        <section className="policy-section">
          <h2>Our Mission</h2>
          <p>
            At TODO App, our mission is to simplify task management and boost productivity for individuals 
            and teams worldwide. We believe that effective task management shouldn't be complicated, 
            which is why we've designed an intuitive and powerful platform that helps you focus on 
            what matters most.
          </p>
        </section>

        <section className="policy-section">
          <h2>What We Offer</h2>
          <p>
            TODO App is a comprehensive task management solution that helps you organize your personal 
            and professional life. Our platform offers:
          </p>
          <ul>
            <li>Intuitive task creation and organization</li>
            <li>Real-time synchronization across all your devices</li>
            <li>Powerful search and filtering capabilities</li>
            <li>Collaboration features for team projects</li>
            <li>Secure cloud storage for your important notes and files</li>
            <li>Cross-platform compatibility (Web, iOS, Android)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2025 by Dhanraj Singh, TODO App was born out of a need for a simple yet powerful 
            task management solution. As a developer and productivity enthusiast, Dhanraj realized that 
            existing tools were either too complex or too limited. He set out to create a tool that 
            would combine the best of both worlds.
          </p>
          <p>
            Since our launch, we've helped thousands of users organize their tasks, achieve their goals, 
            and boost their productivity. Our user base continues to grow as more people discover the 
            simplicity and power of TODO App.
          </p>
        </section>

        <section className="policy-section">
          <h2>Our Values</h2>
          <ul>
            <li><strong>Simplicity:</strong> We believe in keeping things simple and intuitive</li>
            <li><strong>Efficiency:</strong> Our tools are designed to maximize your productivity</li>
            <li><strong>Privacy:</strong> Your data belongs to you, and we protect it fiercely</li>
            <li><strong>Innovation:</strong> We continuously improve and evolve our platform</li>
            <li><strong>User Focus:</strong> Everything we do is centered around our users' needs</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Join Our Community</h2>
          <p>
            Become part of our growing community of productive individuals and teams. Whether you're 
            managing personal tasks, planning a project, or coordinating with your team, TODO App 
            is here to help you succeed.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;