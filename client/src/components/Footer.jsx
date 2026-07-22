import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
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
              <i className="fa-solid fa-circle-check"></i> Subscribed for updates!
            </span>
          ) : (
            <form onSubmit={handleSubscribe} className="footer-subscribe-form">
              <input
                type="email"
                placeholder="Enter email for updates..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="footer-subscribe-input"
                required
              />
              <button type="submit" className="footer-subscribe-btn">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </footer>
  );
}
