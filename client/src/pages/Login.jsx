import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
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
      await api.post('/api/auth/login', { email, password });
      await fetchUser();
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Invalid credentials');
      } else {
        setError('Login failed. Please try again.');
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
          <h1 className="title">Login</h1>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius)', background: 'var(--danger-bg)', color: 'var(--danger)', marginBottom: '16px', fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
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
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p>
            Don't have an account?{' '}
            <Link to="/register">Register here</Link>
          </p>

          <p>
            Doctor account?{' '}
            <Link to="/doctor/login">Doctor login</Link>
          </p>

          {/* google login button */}
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '15px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }}></div>
              <span style={{ padding: '0 10px', fontWeight: 550, textTransform: 'uppercase' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }}></div>
            </div>
            <a
              href="/auth/google"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                width: '100%',
                border: '1.5px solid var(--line)',
                borderRadius: 'var(--radius)',
                padding: '12px 16px',
                fontWeight: 600,
                textDecoration: 'none',
                color: 'var(--text)',
                background: 'var(--surface)',
                transition: 'background-color 0.2s, border-color 0.2s',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-warm)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface)';
                e.currentTarget.style.borderColor = 'var(--line)';
              }}
            >
              <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.336 0 3.327 2.673 1.327 6.573L5.266 9.765z" />
                <path fill="#4285F4" d="M23.491 12.273c0-.818-.073-1.609-.209-2.373H12v4.509h6.445c-.277 1.482-1.11 2.736-2.364 3.582l3.864 2.99A11.896 11.896 0 0 0 23.491 12.273z" />
                <path fill="#FBBC05" d="M5.266 14.235A7.127 7.127 0 0 1 4.909 12c0-.79.136-1.545.357-2.235L1.327 6.573A11.97 11.97 0 0 0 0 12c0 2.018.5 3.927 1.382 5.618l3.884-3.383z" />
                <path fill="#34A853" d="M12 24c3.245 0 5.973-1.073 7.964-2.91l-3.864-2.99C15.027 18.782 13.627 19.09 12 19.09c-3.155 0-5.818-2.127-6.773-4.99L1.345 17.482C3.355 21.355 7.355 24 12 24z" />
              </svg>
              Continue with Google
            </a>
          </div>
        </div>
      </div>

      {/* right side image */}
      <div className="auth-right">
        <div className="auth-right-content-wrapper">
          <div className="auth-right-logo">
            <span className="auth-logo-icon"><i className="fa-solid fa-heart-pulse"></i></span>
            <span className="auth-logo-text">Empathezee</span>
          </div>
          <h2 className="auth-right-title">You don't have to fight your illness alone.</h2>
          <p className="auth-right-subtitle">Connect with patients who understand, share experiences, consult verified doctors, and access curated health tracking tools.</p>
          <div className="auth-right-stats">
            <div className="auth-stat-item">
              <span className="auth-stat-num">10k+</span>
              <span className="auth-stat-lbl">Active Peers</span>
            </div>
            <div className="auth-stat-item">
              <span className="auth-stat-num">250+</span>
              <span className="auth-stat-lbl">Verified Doctors</span>
            </div>
            <div className="auth-stat-item">
              <span className="auth-stat-num">50+</span>
              <span className="auth-stat-lbl">Support Groups</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
