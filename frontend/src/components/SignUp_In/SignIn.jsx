// frontend/src/components/SignUp_In/SignIn.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/userSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:1000';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/login`,
        form,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // 确保 res.data 和 res.data.user 存在
      if (!res.data || !res.data.user) {
        throw new Error('Invalid response structure');
      }

      const userData = {
        _id: res.data.user.id,
        email: res.data.user.email,
        username: res.data.user.username
      };

      dispatch(login(userData));
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("Login successful!");
      navigate('/todo');
    } catch (err) {
      // Don't log sensitive information like passwords
      console.error("Login error:", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Login failed. Please check your credentials and try again.");
      }
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        <p className="form-subtitle">Access your account</p>
        
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
            autoComplete="current-password"
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        
        <button type="submit" className="submit-btn">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;