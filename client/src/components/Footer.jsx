import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import api from '../services/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      await api.post('/api/auth/subscribe', { email: email.trim() });
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="main-footer" role="contentinfo">
      <div className="footer-inner-compact">
        {/* Left: Brand Logo & Copyright */}
        <div className="footer-compact-brand">
          <Link to="/" className="footer-logo" aria-label="Empathezee home">
            <Logo size="24" />
            <span className="footer-brand-title">Empathezee</span>
          </Link>
          <span className="footer-copyright-text">
            © {new Date().getFullYear()} Empathezee. All rights reserved.
          </span>
        </div>

        {/* Center: Footer Links */}
        <nav className="footer-compact-links" aria-label="Footer legal and safety links">
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/analytics">Safety & Trust</Link>
        </nav>

        {/* Right: Newsletter Subscribe */}
        <div className="footer-compact-right">
          {subscribed ? (
            <span className="footer-subscribed-badge">
              <i className="fa-solid fa-circle-check"></i> Subscribed! Thank you email sent.
            </span>
          ) : (
            <form onSubmit={handleSubscribe} className="footer-subscribe-form">
              <input
                type="email"
                placeholder="Enter email for updates..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="footer-subscribe-input"
                disabled={loading}
                required
              />
              <button type="submit" className="footer-subscribe-btn" disabled={loading}>
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
              {errorMsg && <div className="footer-subscribe-error" style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errorMsg}</div>}
            </form>
          )}
        </div>
      </div>
    </footer>
  );
}
