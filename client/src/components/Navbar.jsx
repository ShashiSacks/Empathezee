import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lang) => {
    setSelectedLang(lang);
    if (lang === 'en') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    } else {
      document.cookie = `googtrans=/en/${lang}; path=/;`;
      document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;
    }
    window.location.reload();
  };

  const isActive = (path) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const toggleMobileDrawer = (open) => {
    setMobileOpen(open);
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  return (
    <>
      <nav className={`main-navbar ${isScrolled ? 'scrolled' : ''}`} id="main-navbar">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo" aria-label="Empathezee Home">
            <Logo size="32" />
            <span className="nav-logo-text">Empathezee</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-links" id="desktop-nav">
            {user ? (
              user.role === 'doctor' ? (
                <>
                  <Link to="/doctor/dashboard" id="nav-doctor-dashboard" className={isActive('/doctor/dashboard') ? 'active' : ''}>
                    <i className="fa-solid fa-stethoscope" aria-hidden="true"></i>
                    <span>Doctor Dashboard</span>
                  </Link>
                  <Link to="/medicine" id="nav-medicines-dr" className={isActive('/medicine') ? 'active' : ''}>
                    <i className="fa-solid fa-pills" aria-hidden="true"></i>
                    <span>Medicines</span>
                  </Link>
                  <Link to="/analytics" id="nav-analytics-dr" className={isActive('/analytics') ? 'active' : ''}>
                    <i className="fa-solid fa-chart-line" aria-hidden="true"></i>
                    <span>Analytics</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" id="nav-dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                    <i className="fa-solid fa-house" aria-hidden="true"></i>
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/communities" id="nav-communities" className={isActive('/communities') ? 'active' : ''}>
                    <i className="fa-solid fa-people-group" aria-hidden="true"></i>
                    <span>Communities</span>
                  </Link>
                  <Link to="/doctor/search" id="nav-doctors" className={isActive('/doctor/search') ? 'active' : ''}>
                    <i className="fa-solid fa-user-doctor" aria-hidden="true"></i>
                    <span>Find Doctors</span>
                  </Link>
                  <Link to="/appointments-ui" id="nav-appointments" className={isActive('/appointments-ui') ? 'active' : ''}>
                    <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
                    <span>Appointments</span>
                  </Link>
                  <Link to="/medicine" id="nav-medicines" className={isActive('/medicine') ? 'active' : ''}>
                    <i className="fa-solid fa-pills" aria-hidden="true"></i>
                    <span>Medicines</span>
                  </Link>
                  <Link to="/wellness" id="nav-wellness" className={isActive('/wellness') ? 'active' : ''}>
                    <i className="fa-solid fa-heart-pulse" aria-hidden="true"></i>
                    <span>Wellness</span>
                  </Link>
                  <Link to="/analytics" id="nav-analytics" className={isActive('/analytics') ? 'active' : ''}>
                    <i className="fa-solid fa-chart-line" aria-hidden="true"></i>
                    <span>Analytics</span>
                  </Link>
                </>
              )
            ) : (
              <div className="nav-links-auth-group">
                {/* Patient Portal Link Group */}
                <div className="nav-portal-group">
                  <span className="portal-badge">
                    <i className="fa-solid fa-user" aria-hidden="true" style={{ fontSize: '0.72rem' }}></i>
                    <span>Patient</span>
                  </span>
                  <Link to="/login" id="nav-login" className={`nav-portal-link ${isActive('/login') ? 'active' : ''}`}>
                    <i className="fa-solid fa-right-to-bracket"></i> Login
                  </Link>
                  <Link to="/register" id="nav-register" className={`nav-portal-link ${isActive('/register') ? 'active' : ''}`}>
                    <i className="fa-solid fa-user-plus"></i> Register
                  </Link>
                </div>

                <span className="nav-group-divider">|</span>

                {/* Doctor Portal Link Group */}
                <div className="nav-portal-group">
                  <span className="portal-badge">
                    <i className="fa-solid fa-stethoscope" aria-hidden="true" style={{ fontSize: '0.78rem' }}></i>
                    <span>Doctor</span>
                  </span>
                  <Link to="/doctor/login" id="nav-doctor-login" className={`nav-portal-link ${isActive('/doctor/login') ? 'active' : ''}`}>
                    <i className="fa-solid fa-stethoscope"></i> Login
                  </Link>
                  <Link to="/register?role=doctor" id="nav-doctor-register" className={`nav-portal-link ${isActive('/register?role=doctor') ? 'active' : ''}`}>
                    <i className="fa-solid fa-user-doctor"></i> Register
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="nav-actions">
            {/* Language Selector */}
            <div className="lang-selector-container notranslate" role="navigation" aria-label="Language selection">
              <span className="lang-icon" aria-hidden="true">🌐</span>
              <select
                id="language-selector"
                value={selectedLang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="lang-select"
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="ur">Urdu (اردو)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="ml">Malayalam (മലയാളം)</option>
                <option value="mr">Marathi (मराठी)</option>
                <option value="bn">Bengali (বাংলা)</option>
                <option value="gu">Gujarati (ગુજરાતી)</option>
                <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
                <option value="or">Odia (ଓଡ଼ିଆ)</option>
                <option value="ar">Arabic (العربية)</option>
                <option value="zh-CN">Chinese Simplified (简体中文)</option>
                <option value="zh-TW">Chinese Traditional (繁體中文)</option>
                <option value="nl">Dutch (Nederlands)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
                <option value="el">Greek (Ελληνικά)</option>
                <option value="id">Indonesian</option>
                <option value="it">Italiano</option>
                <option value="ja">Japanese (日本語)</option>
                <option value="ko">Korean (한국어)</option>
                <option value="fa">Persian (فارسی)</option>
                <option value="pl">Polski</option>
                <option value="pt">Português</option>
                <option value="ru">Русский</option>
                <option value="es">Español</option>
                <option value="sv">Svenska</option>
                <option value="th">Thai (ไทย)</option>
                <option value="tr">Turkish (Türkçe)</option>
                <option value="uk">Ukrainian (Українська)</option>
                <option value="vi">Vietnamese (Tiếng Việt)</option>
              </select>
            </div>

            {/* SOS Emergency */}
            <a href="tel:112" className="nav-sos-btn" id="nav-sos" aria-label="Emergency call 112">
              <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
              <span className="notranslate">SOS</span>
            </a>

            {/* Logout */}
            {user && (
              <button onClick={logout} className="nav-logout-btn" id="nav-logout" aria-label="Logout" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <i className="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
                <span>Logout</span>
              </button>
            )}

            {/* Hamburger */}
            <button
              className="nav-hamburger"
              id="hamburger-btn"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
              onClick={() => toggleMobileDrawer(!mobileOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`nav-mobile-drawer ${mobileOpen ? 'open' : ''}`} id="mobile-drawer" role="navigation" aria-label="Mobile navigation" aria-hidden={!mobileOpen}>
        <button className="nav-drawer-close" id="drawer-close" aria-label="Close menu" onClick={() => toggleMobileDrawer(false)}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div style={{ marginBottom: '12px' }}>
          <div className="nav-logo" style={{ textDecoration: 'none', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Logo size="28" />
            <span className="nav-logo-text" style={{ fontSize: '1rem' }}>Empathezee</span>
          </div>
        </div>

        {user ? (
          user.role === 'doctor' ? (
            <>
              <Link to="/doctor/dashboard" id="mob-nav-doctor-dashboard" onClick={() => toggleMobileDrawer(false)}><i className="fa-solid fa-stethoscope" style={{ width: '18px' }}></i> Doctor Dashboard</Link>
              <Link to="/medicine" id="mob-nav-medicines-dr" onClick={() => toggleMobileDrawer(false)}><i className="fa-solid fa-pills" style={{ width: '18px' }}></i> Medicines</Link>
              <Link to="/analytics" id="mob-nav-analytics-dr" onClick={() => toggleMobileDrawer(false)}><i className="fa-solid fa-chart-line" style={{ width: '18px' }}></i> Analytics</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" id="mob-nav-dashboard" onClick={() => toggleMobileDrawer(false)}><i className="fa-solid fa-house" style={{ width: '18px' }}></i> Dashboard</Link>
              <Link to="/communities" id="mob-nav-communities" onClick={() => toggleMobileDrawer(false)}><i className="fa-solid fa-people-group" style={{ width: '18px' }}></i> Communities</Link>
              <Link to="/doctor/search" id="mob-nav-doctors" onClick={() => toggleMobileDrawer(false)}><i className="fa-solid fa-user-doctor" style={{ width: '18px' }}></i> Find Doctors</Link>
              <Link to="/appointments-ui" id="mob-nav-appointments" onClick={() => toggleMobileDrawer(false)}><i className="fa-solid fa-calendar-check" style={{ width: '18px' }}></i> Appointments</Link>
              <Link to="/medicine" id="mob-nav-medicines" onClick={() => toggleMobileDrawer(false)}><i className="fa-solid fa-pills" style={{ width: '18px' }}></i> Medicines</Link>
              <Link to="/wellness" id="mob-nav-wellness" onClick={() => toggleMobileDrawer(false)}><i className="fa-solid fa-seedling" style={{ width: '18px' }}></i> Mental Wellness</Link>
              <Link to="/analytics" id="mob-nav-analytics" onClick={() => toggleMobileDrawer(false)}><i className="fa-solid fa-chart-line" style={{ width: '18px' }}></i> Analytics</Link>
            </>
          )
        ) : (
          <div className="mobile-auth-sections">
            <div className="mobile-section-block">
              <div className="mobile-section-title">👤 Patient Portal</div>
              <Link to="/login" id="mob-nav-login" onClick={() => toggleMobileDrawer(false)}>
                <i className="fa-solid fa-arrow-right-to-bracket" style={{ width: '18px' }}></i> Patient Login
              </Link>
              <Link to="/register" id="mob-nav-register" onClick={() => toggleMobileDrawer(false)}>
                <i className="fa-solid fa-user-plus" style={{ width: '18px' }}></i> Patient Register
              </Link>
            </div>

            <div className="mobile-section-block" style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px dashed var(--border)' }}>
              <div className="mobile-section-title doctor-title">🩺 Doctor Portal</div>
              <Link to="/doctor/login" id="mob-nav-doctor-login" onClick={() => toggleMobileDrawer(false)}>
                <i className="fa-solid fa-stethoscope" style={{ width: '18px' }}></i> Doctor Login
              </Link>
              <Link to="/register?role=doctor" id="mob-nav-doctor-register" onClick={() => toggleMobileDrawer(false)}>
                <i className="fa-solid fa-user-doctor" style={{ width: '18px' }}></i> Doctor Register
              </Link>
            </div>
          </div>
        )}

        {user && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
            <button onClick={() => { toggleMobileDrawer(false); logout(); }} style={{ color: 'var(--danger)', background: 'var(--danger-bg)', width: '100%', border: 'none', textAlign: 'left', padding: '10px 14px', borderRadius: 'var(--radius)', cursor: 'pointer' }} id="mob-nav-logout">
              <i className="fa-solid fa-right-from-bracket" style={{ width: '18px' }}></i> Logout
            </button>
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <a href="tel:112" style={{ color: 'var(--danger)', background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.2)' }} id="mob-nav-sos">
            <i className="fa-solid fa-circle-exclamation" style={{ width: '18px' }}></i> Emergency — Call 112
          </a>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`nav-overlay ${mobileOpen ? 'open' : ''}`} id="nav-overlay" aria-hidden={!mobileOpen} onClick={() => toggleMobileDrawer(false)}></div>

      {/* Mobile Bottom Navigation */}
      {user && user.role !== 'doctor' && (
        <nav className="mobile-bottom-nav" aria-label="Bottom navigation">
          <Link to="/dashboard" className={`mobile-nav-item ${isActive('/dashboard') ? 'active' : ''}`} id="mob-bottom-dashboard">
            <span className="mobile-nav-icon"><i className="fa-solid fa-house"></i></span>
            <span>Home</span>
          </Link>
          <Link to="/communities" className={`mobile-nav-item ${isActive('/communities') ? 'active' : ''}`} id="mob-bottom-communities">
            <span className="mobile-nav-icon"><i className="fa-solid fa-people-group"></i></span>
            <span>Community</span>
          </Link>
          <Link to="/doctor/search" className={`mobile-nav-item ${isActive('/doctor/search') ? 'active' : ''}`} id="mob-bottom-doctors">
            <span className="mobile-nav-icon"><i className="fa-solid fa-user-doctor"></i></span>
            <span>Doctors</span>
          </Link>
          <Link to="/medicine" className={`mobile-nav-item ${isActive('/medicine') ? 'active' : ''}`} id="mob-bottom-medicine">
            <span className="mobile-nav-icon"><i className="fa-solid fa-pills"></i></span>
            <span>Medicines</span>
          </Link>
          <Link to="/appointments-ui" className={`mobile-nav-item ${isActive('/appointments-ui') ? 'active' : ''}`} id="mob-bottom-appts">
            <span className="mobile-nav-icon"><i className="fa-solid fa-calendar-check"></i></span>
            <span>Appointments</span>
          </Link>
        </nav>
      )}
    </>
  );
}
