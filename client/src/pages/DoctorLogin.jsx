import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DoctorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/api/auth/doctor/login', { email, password });
      await fetchUser();
      navigate('/doctor/dashboard');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Invalid credentials');
      } else {
        setError('Doctor login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* left side (form area) */}
      <div className="auth-left">
        <div className="auth-left-content">
          <h1 className="title">Doctor Login</h1>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius)', background: 'var(--danger-bg)', color: 'var(--danger)', marginBottom: '16px', fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Doctor email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login as Doctor'}
            </button>
          </form>

          <p>
            Need a doctor account?{' '}
            <Link to="/doctor/register">Register here</Link>
          </p>

          <p>
            Patient account?{' '}
            <Link to="/login">Patient login</Link>
          </p>
        </div>
      </div>

      {/* right side image */}
      <div className="auth-right">
        <div className="auth-right-content-wrapper">
          <div className="auth-right-logo">
            <span className="auth-logo-icon"><i className="fa-solid fa-heart-pulse"></i></span>
            <span className="auth-logo-text">Empathezee Pro</span>
          </div>
          <h2 className="auth-right-title">Empower patients, guide support groups.</h2>
          <p className="auth-right-subtitle">Join our verified network of medical specialists. Moderate discussions, host online consultations, and help patients manage chronic conditions.</p>
          <div className="auth-right-stats">
            <div className="auth-stat-item">
              <span className="auth-stat-num">24/7</span>
              <span className="auth-stat-lbl">Care Guidance</span>
            </div>
            <div className="auth-stat-item">
              <span className="auth-stat-num">15k+</span>
              <span className="auth-stat-lbl">Patient Interactions</span>
            </div>
            <div className="auth-stat-item">
              <span className="auth-stat-num">100%</span>
              <span className="auth-stat-lbl">Verified Specialists</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
