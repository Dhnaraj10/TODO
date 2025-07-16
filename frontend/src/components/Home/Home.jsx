import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/todo'); // ✅ Corrected route
  };

  return (
    <div className="home-container">
      <h1 className="main-heading">Welcome to TODO — Your Productivity Partner</h1>
      <p className="sub-heading">
        Organize your day, focus your tasks, and achieve your goals with clarity and precision. 
        Our simple and secure TODO app is built for developers, students, and professionals.
      </p>
      <button className="todo-button" onClick={handleClick}>
        Make Todo List
      </button>
    </div>
  );
};

export default Home;
