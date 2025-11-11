// frontend/src/App.js
import React, { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';
import SignIn from './components/SignUp_In/SignIn';
import SignUp from './components/SignUp_In/SignUp';
import Todo from './components/Todo/Todo';
import Privacy from './components/FooterPages/Privacy';
import Terms from './components/FooterPages/Terms';
import Contact from './components/FooterPages/Contact';
import About from './components/FooterPages/About';
import Profile from './components/Navbar/Profile';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useDispatch } from 'react-redux';
import { setUser, logout } from './redux/userSlice'; // ✅ fixed import

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.removeItem("user");
    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="logout-container">
      <div className="logout-content">
        <h1>You have been logged out</h1>
        <p>Thank you for using our task management application.</p>
        <div className="logout-actions">
          <a href="/signin" className="logout-btn">Sign In Again</a>
          <a href="/" className="logout-btn secondary">Return to Home</a>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser))); // ✅ using setUser
    }
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </Router>
  );
};

export default App;