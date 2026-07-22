import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="main-footer" role="contentinfo">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label="Empathezee home">
            <div className="footer-logo-icon" aria-hidden="true">💙</div>
            <span>Empathezee</span>
          </Link>
          <p>A premium healthcare community where people with chronic illnesses find support, doctors, and hope — together.</p>
          <div className="footer-social" aria-label="Social media links">
            <a href="#" aria-label="Twitter"><i className="fa-brands fa-x-twitter" aria-hidden="true"></i></a>
            <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram" aria-hidden="true"></i></a>
            <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f" aria-hidden="true"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in" aria-hidden="true"></i></a>
          </div>
        </div>

        {/* Platform */}
        <div>
          <p className="footer-heading">Platform</p>
          <nav className="footer-links" aria-label="Platform links">
            <Link to="/communities" id="footer-communities">Communities</Link>
            <Link to="/doctor/search" id="footer-doctors">Find Doctors</Link>
            <Link to="/appointments-ui" id="footer-appointments">Appointments</Link>
            <Link to="/medicine" id="footer-medicines">Medicines</Link>
            <Link to="/analytics" id="footer-analytics">Analytics</Link>
          </nav>
        </div>

        {/* Support */}
        <div>
          <p className="footer-heading">Support</p>
          <nav className="footer-links" aria-label="Support links">
            <a href="#" id="footer-about">About Empathezee</a>
            <Link to="/wellness" id="footer-mental-wellness">Mental Wellness</Link>
            <a href="#" id="footer-privacy">Privacy Policy</a>
            <a href="#" id="footer-terms">Terms of Service</a>
            <a href="#" id="footer-contact">Contact Us</a>
          </nav>
        </div>

        {/* Newsletter */}
        <div>
          <p className="footer-heading">Stay Updated</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, rgba(255,255,255,0.5))', marginBottom: '14px', lineHeight: 1.6 }}>
            Get wellness tips, community updates, and health resources delivered to your inbox.
          </p>
          <div className="footer-newsletter">
            <input
              type="email"
              placeholder="Your email address"
              id="footer-newsletter-input"
              aria-label="Email for newsletter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="primary"
              size="sm"
              id="footer-newsletter-btn"
              style={{ borderRadius: '999px', fontSize: '0.82rem', background: subscribed ? 'var(--secondary)' : '' }}
              onClick={handleSubscribe}
            >
              {subscribed ? (
                <><i className="fa-solid fa-check" aria-hidden="true"></i> Subscribed!</>
              ) : (
                <><i className="fa-solid fa-paper-plane" aria-hidden="true"></i> Subscribe</>
              )}
            </Button>
          </div>

          {/* Emergency */}
          <div className="footer-helpline" style={{ marginTop: '16px' }} role="complementary" aria-label="Emergency helpline">
            <i className="fa-solid fa-phone" aria-hidden="true" style={{ color: 'var(--danger)' }}></i>
            Emergency Helpline: <span>112</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Empathezee. All rights reserved. Made with 💙 for patients worldwide.</p>
        <p>Dedicated to doctor-patient support &amp; community health.</p>
      </div>
    </footer>
  );
}
