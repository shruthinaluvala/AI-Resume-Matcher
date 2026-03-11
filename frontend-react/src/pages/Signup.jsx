import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import GoogleAccountChooser from '../components/GoogleAccountChooser';
import './Auth.css';

export default function Signup({ setAuthToken }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const API_URL = 'http://localhost:5001/api';

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/signup`, { name, email, password });
      if (response.data.token) {
        localStorage.setItem('skillmatch_token', response.data.token);
        localStorage.setItem('skillmatch_user', JSON.stringify(response.data.user));
        setAuthToken(response.data.token);
        navigate('/my-resumes'); // Auto login after signup
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginClick = () => {
    setIsGoogleModalOpen(true);
  };

  const handleGoogleAccountSelected = async (account) => {
    setIsGoogleModalOpen(false);
    try {
      const response = await axios.post(`${API_URL}/google-login`, { 
        email: account.email, 
        name: account.name 
      });
        if (response.data.token) {
          localStorage.setItem('skillmatch_token', response.data.token);
          localStorage.setItem('skillmatch_user', JSON.stringify(response.data.user));
          setAuthToken(response.data.token);
          navigate('/my-resumes');
        }
    } catch (err) {
      setError("Google Sign-In backend communication failed.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create an Account</h2>
          <p>Join SkillMatch AI to build ATS-friendly resumes.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="social-auth">
          <button className="google-btn" onClick={handleGoogleLoginClick}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="google-icon" />
            Sign up with Google
          </button>
        </div>

        <div className="auth-divider">
          <span>or sign up with email</span>
        </div>

        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group mb-4">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-6">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>

      <GoogleAccountChooser 
        isOpen={isGoogleModalOpen} 
        onClose={() => setIsGoogleModalOpen(false)}
        onSelect={handleGoogleAccountSelected}
      />
    </div>
  );
}
