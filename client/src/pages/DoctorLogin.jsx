import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Button, Alert } from '../components/ui';

export default function DoctorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        const msg = typeof err.response.data === 'string'
          ? err.response.data
          : err.response.data.message || 'Invalid credentials';
        setError(msg);
      } else {
        setError('Doctor login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: 'fa-solid fa-users',         label: 'Patient Interactions' },
    { icon: 'fa-solid fa-video',          label: 'Secure Telehealth Sessions' },
    { icon: 'fa-solid fa-calendar-check', label: 'Practice Management Tools' },
    { icon: 'fa-solid fa-shield-halved',  label: 'Verified Doctor Badge' },
  ];

  return (
    <div className="auth-container">
      {/* left side (form area) */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', justifyContent: 'center' }}>
            <Logo size="32" />
            <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Doctor Portal</span>
          </div>

          {/* Doctor portal banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'var(--accent-50)', border: '1px solid rgba(2,132,199,0.2)', borderRadius: 'var(--radius-full)', marginBottom: '24px', justifyContent: 'center' }}>
            <i className="fa-solid fa-stethoscope" style={{ color: 'var(--accent)', fontSize: '0.85rem' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-dark)', letterSpacing: '0.3px' }}>MEDICAL PROFESSIONAL ACCESS</span>
          </div>

          <h1 className="title" style={{ marginBottom: '6px', fontSize: '1.6rem' }}>Doctor Sign In</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '28px' }}>
            Access your doctor dashboard and patient management
          </p>

          {error && (
            <Alert type="error" onDismiss={() => setError('')} style={{ marginBottom: '20px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ gap: '18px' }}>
            <div className="form-group">
              <label htmlFor="doctor-login-email">
                Doctor email
              </label>
              <input
                id="doctor-login-email"
                type="email"
                name="email"
                placeholder="doctor@hospital.com"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="doctor-login-password">Password</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="doctor-login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((p) => !p)}
                >
                  <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="accent"
              fullWidth
              loading={loading}
              id="doctor-login-submit-btn"
              style={{ marginTop: '4px' }}
            >
              {loading ? 'Signing in…' : 'Sign in to Doctor Portal'}
            </Button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p>
              New doctor?{' '}
              <Link to="/doctor/register" style={{ fontWeight: 700, color: 'var(--accent)' }}>Register your practice</Link>
            </p>
            <p>
              Patient?{' '}
              <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary)' }}>Patient login</Link>
            </p>
          </div>
        </div>
      </div>

      {/* right panel */}
      <div className="auth-right">
        <div className="auth-right-content-wrapper">
          <div className="auth-right-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Logo size="36" />
            <span className="auth-logo-text" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Empathezee Pro</span>
          </div>
          <h2 className="auth-right-title">Empower patients, guide support groups.</h2>
          <p className="auth-right-subtitle">Join our verified network of medical specialists. Moderate discussions, host telehealth sessions, and help patients manage chronic conditions.</p>

          <div className="auth-feature-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
            {features.map(({ icon, label }) => (
              <div
                key={label}
                className="auth-feature-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '9px', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={icon} style={{ fontSize: '1rem' }} />
                </div>
                <span style={{ fontWeight: 500, fontSize: '1rem', color: 'white' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
