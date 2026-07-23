import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import api from '../services/api';
import { CheckCircle2, Send, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';

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
    <footer className="footer-redesign" role="contentinfo">
      <div className="footer-grid-container">
        {/* Column 1: Brand Identity & Mission */}
        <div className="footer-col-brand">
          <Link to="/" className="footer-logo-brand" aria-label="Empathezee Home">
            <Logo size={32} />
            <span className="footer-brand-title">Empathezee</span>
          </Link>
          <p className="footer-brand-desc">
            Empowering individuals and communities with empathetic healthcare, verified medical consultations, and peer support networks. You never have to face illness alone.
          </p>
          <div className="footer-trust-badge">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>HIPAA-Compliant & Secure Data Architecture</span>
          </div>
        </div>

        {/* Column 2: Patients & Community */}
        <div className="footer-col-links">
          <h4 className="footer-col-heading">Patients</h4>
          <ul className="footer-links-list">
            <li><Link to="/communities">Find Peer Communities</Link></li>
            <li><Link to="/doctor/search">Consult Verified Doctors</Link></li>
            <li><Link to="/appointments-ui">Book Appointments</Link></li>
            <li><Link to="/medicine">Medication Catalog</Link></li>
          </ul>
        </div>

        {/* Column 3: Doctors & Care Providers */}
        <div className="footer-col-links">
          <h4 className="footer-col-heading">Care Providers</h4>
          <ul className="footer-links-list">
            <li><Link to="/doctor/login">Doctor Portal Login</Link></li>
            <li><Link to="/doctor/register">Join Provider Network</Link></li>
            <li><Link to="/doctor/dashboard">Clinical Dashboard</Link></li>
            <li><Link to="/analytics">Trust & Verification</Link></li>
          </ul>
        </div>

        {/* Column 4: Resources & Safety */}
        <div className="footer-col-links">
          <h4 className="footer-col-heading">Resources</h4>
          <ul className="footer-links-list">
            <li><Link to="/wellness">Mental Wellness Hub</Link></li>
            <li><Link to="/analytics">Safety Guidelines</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li>
              <a href="tel:112" className="footer-emergency-link">
                <PhoneCall className="w-3.5 h-3.5" /> Emergency Helpline (112)
              </a>
            </li>
          </ul>
        </div>

        {/* Column 5: Newsletter Subscription */}
        <div className="footer-col-newsletter">
          <h4 className="footer-col-heading">Stay Connected</h4>
          <p className="footer-newsletter-desc">
            Receive curated health insights, medical research updates, and community highlights.
          </p>

          {subscribed ? (
            <div className="footer-subscribed-card">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Subscribed! Thank you email sent to your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="footer-newsletter-form">
              <div className="footer-input-group">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="footer-email-input"
                  disabled={loading}
                  required
                />
                <button type="submit" className="footer-send-btn" disabled={loading} aria-label="Subscribe">
                  {loading ? '...' : <Send className="w-4 h-4" />}
                </button>
              </div>
              {errorMsg && <p className="footer-error-text">{errorMsg}</p>}
            </form>
          )}
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom-bar">
        <p className="footer-copyright">
          © {new Date().getFullYear()} Empathezee Health Technologies Inc. All rights reserved.
        </p>
        <div className="footer-legal-links">
          <Link to="/terms">Privacy Policy</Link>
          <span className="dot-divider">•</span>
          <Link to="/terms">Terms of Service</Link>
          <span className="dot-divider">•</span>
          <Link to="/analytics">Security Standards</Link>
        </div>
      </div>
    </footer>
  );
}
