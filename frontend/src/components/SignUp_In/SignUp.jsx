// frontend/src/components/SignUp_In/SignUp.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/userSlice';

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.warning("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:1000/api/v1/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      toast.success("Registration successful!");

      const userData = {
        _id: res.data.user._id,
        email: res.data.user.email,
      };

      dispatch(login(userData));
      localStorage.setItem("user", JSON.stringify(userData));

      navigate('/todo');
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      toast.error(msg);

      if (msg.toLowerCase().includes("already exists")) {
        setTimeout(() => navigate('/signin'), 1500);
      }
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        <p className="form-subtitle">Join TODO to manage tasks like a pro</p>

        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />

        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
