import React from 'react';
import './Aboutus.css';

export const Aboutus = () => {
  return (
    <div className="aboutus-container">
      <div className="aboutus-content">
        <h1 className="aboutus-title">About TODO</h1>
        <p className="aboutus-text">
          <b>TODO</b> is more than just a task manager — it's your personal productivity partner.
          Designed with simplicity and efficiency in mind, TODO empowers individuals to take control of their day, 
          organize their goals, and track progress effortlessly.
        </p>
        <p className="aboutus-text">
          Whether you're a student juggling assignments, a professional planning projects, or anyone striving for structure — 
          <b>TODO</b> offers a clean, intuitive interface to help you focus on what matters most. 
          With fast performance, elegant design, and powerful features, our app ensures your productivity never misses a beat.
        </p>
        <p className="aboutus-highlight">
          Because staying productive shouldn't be complicated. With <b>TODO</b>, it's just you and your goals — clearly defined.
        </p>
      </div>
    </div>
  );
};

export default Aboutus;
