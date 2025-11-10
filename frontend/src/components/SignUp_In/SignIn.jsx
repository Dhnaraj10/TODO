// frontend/src/components/SignUp_In/SignIn.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/userSlice';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:1000';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/signin`, form);

      const userData = {
        _id: res.data.user._id,
        email: res.data.user.email,
      };

      dispatch(login(userData));
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("Login successful!");
      navigate('/todo');
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);

      if (msg.toLowerCase().includes("sign up")) {
        setTimeout(() => navigate('/signup'), 1500);
      }
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p className="form-subtitle">Login to access your TODO dashboard</p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;