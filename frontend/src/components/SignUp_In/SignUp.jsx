// frontend/src/components/SignUp_In/SignUp.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SignUp.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/userSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:1000';

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordMatchError, setShowPasswordMatchError] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    
    // Reset the timeout whenever the user types
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set a new timeout to check password match after 2 seconds of inactivity
    if (e.target.name === 'confirmPassword' && e.target.value) {
      const newTimeout = setTimeout(() => {
        if (form.password !== e.target.value) {
          setShowPasswordMatchError(true);
        } else {
          setShowPasswordMatchError(false);
        }
      }, 2000);
      
      setTypingTimeout(newTimeout);
    } else if (e.target.name === 'confirmPassword') {
      // Hide error immediately if confirm password is empty
      setShowPasswordMatchError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (form.password !== form.confirmPassword) {
      setShowPasswordMatchError(true);
      toast.warning("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/register`, {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      toast.success("Registration successful!");

      const userData = {
        _id: res.data.user.id, // Use id instead of _id to match backend response
        email: res.data.user.email,
        username: res.data.user.username
      };

      dispatch(login(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      navigate('/todo');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <p className="form-subtitle">Create your account</p>
        
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        
        <div className="password-input-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
            className={showPasswordMatchError ? "password-error" : ""}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        
        {showPasswordMatchError && (
          <div className="password-match-error">
            Passwords do not match
          </div>
        )}
        
        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;