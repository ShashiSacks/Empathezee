import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Send, Check, Phone } from 'lucide-react';

const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    } else {
      document.getElementById('footer-newsletter-input').focus();
    }
  };

  return (
    <footer className="main-footer" role="contentinfo" style={{ background: '#0F172A', color: 'white', padding: '80px 24px 32px' }}>
      <div className="footer-grid" style={{ maxWidth: 'var(--max)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px' }}>
        
        {/* Brand Column */}
        <div className="footer-brand" style={{ display: 'flex', flexDirection: 'column', gap: '16px', gridColumn: 'span 2' }}>
          <Link to="/" className="footer-logo" aria-label="Empathezee home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo size="32" />
            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>Empathezee</span>
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', maxWidth: '320px' }}>A premium healthcare community where people with chronic illnesses find support, doctors, and hope — together.</p>
          <div className="footer-social" aria-label="Social media links" style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <a href="#" aria-label="Twitter" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }}><i className="fa-brands fa-twitter" style={{ fontSize: '1.2rem' }}></i></a>
            <a href="#" aria-label="Instagram" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }}><i className="fa-brands fa-instagram" style={{ fontSize: '1.2rem' }}></i></a>
            <a href="#" aria-label="Facebook" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }}><i className="fa-brands fa-facebook" style={{ fontSize: '1.2rem' }}></i></a>
            <a href="#" aria-label="LinkedIn" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }}><i className="fa-brands fa-linkedin" style={{ fontSize: '1.2rem' }}></i></a>
          </div>
        </div>

        {/* For Patients */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p className="footer-heading" style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem', marginBottom: '8px' }}>For Patients</p>
          <nav className="footer-links" aria-label="Patient links" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/communities" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>Find Communities</Link>
            <Link to="/doctor/search" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>Book a Doctor</Link>
            <Link to="/appointments-ui" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>My Appointments</Link>
            <Link to="/medicine" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>Order Medicines</Link>
            <Link to="/wellness" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>Mental Wellness</Link>
          </nav>
        </div>

        {/* For Doctors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p className="footer-heading" style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem', marginBottom: '8px' }}>For Doctors</p>
          <nav className="footer-links" aria-label="Doctor links" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/doctor/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>Doctor Portal</Link>
            <Link to="/doctor/register" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>Join Empathezee</Link>
            <Link to="/doctor/dashboard" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>Moderation Panel</Link>
            <Link to="/analytics" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>Analytics</Link>
          </nav>
        </div>

        {/* Company */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p className="footer-heading" style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem', marginBottom: '8px' }}>Company</p>
          <nav className="footer-links" aria-label="Company links" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>About Us</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>Careers</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>Terms of Service</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>Contact Us</a>
          </nav>
        </div>

        {/* Stay Updated */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', gridColumn: 'span 2' }}>
          <p className="footer-heading" style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem', marginBottom: '8px' }}>Stay Updated</p>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>Get wellness tips, community updates, and health resources delivered to your inbox.</p>
          <div className="footer-newsletter" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            <input 
              type="email" 
              placeholder="Your email address" 
              id="footer-newsletter-input" 
              aria-label="Email for newsletter" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.95rem', outline: 'none' }} 
            />
            <button 
              className="btn-primary" 
              onClick={handleSubscribe}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', background: subscribed ? 'var(--secondary)' : 'var(--primary)', color: 'white', border: 'none' }}
            >
              {subscribed ? <><Check size={18} /> Subscribed!</> : <><Send size={18} /> Subscribe</>}
            </button>
          </div>
          <div className="footer-helpline" style={{ display: 'flex', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }} role="complementary" aria-label="Emergency helpline">
            <Phone size={18} style={{ color: '#EF4444', marginRight: '8px' }} />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Emergency Helpline:</span> <span style={{ color: 'white', fontWeight: '600', marginLeft: '6px' }}>112</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom" style={{ maxWidth: 'var(--max)', margin: '64px auto 0', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textAlign: 'center' }}>
        <p>&copy; {new Date().getFullYear()} Empathezee. All rights reserved. Made with 💙 for patients worldwide.</p>
        <p>Dedicated to doctor-patient support &amp; community health.</p>
      </div>
      
      <div id="google_translate_element" style={{ display: 'none' }} aria-hidden="true"></div>
    </footer>
  );
};

export default Footer;
