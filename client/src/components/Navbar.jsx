import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { 
  Globe, AlertTriangle, LogOut, Menu, X, Home, Users, 
  Stethoscope, CalendarCheck, Pill, Sparkles, LineChart, 
  LogIn, UserPlus, ShieldHalf 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeDrawer = () => {
    setDrawerOpen(false);
    document.body.style.overflow = '';
  };

  const openDrawer = () => {
    setDrawerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  useEffect(() => {
    closeDrawer();
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className={`main-navbar ${scrolled ? 'scrolled' : ''}`} id="main-navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo" aria-label="Empathezee Home">
            <Logo size="28" />
            <span className="nav-logo-text">Empathezee</span>
          </Link>

          <div className="nav-links" id="desktop-nav">
            {user && user.role === 'doctor' && (
              <>
                <Link to="/doctor/dashboard" className={isActive('/doctor/dashboard') ? 'active' : ''}>Doctor Dashboard</Link>
                <Link to="/medicine" className={isActive('/medicine') ? 'active' : ''}>Medicines</Link>
                <Link to="/analytics" className={isActive('/analytics') ? 'active' : ''}>Analytics</Link>
              </>
            )}
            {user && user.role !== 'doctor' && (
              <>
                <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link>
                <Link to="/communities" className={isActive('/communities') ? 'active' : ''}>Communities</Link>
                <Link to="/doctor/search" className={isActive('/doctor/search') ? 'active' : ''}>Find Doctors</Link>
                <Link to="/appointments-ui" className={isActive('/appointments-ui') ? 'active' : ''}>Appointments</Link>
                <Link to="/medicine" className={isActive('/medicine') ? 'active' : ''}>Medicines</Link>
                <Link to="/wellness" className={isActive('/wellness') ? 'active' : ''}>Wellness</Link>
                <Link to="/analytics" className={isActive('/analytics') ? 'active' : ''}>Analytics</Link>
              </>
            )}
          </div>

          <div className="nav-actions">
            {!user && (
              <>
                <Link to="/doctor/login" style={{ marginRight: '8px', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)', textDecoration: 'none' }}>For Doctors</Link>
                <Link to="/login" className="btn-outline btn-sm" style={{ padding: '8px 16px' }}>Log In</Link>
                <Link to="/register" className="btn-primary btn-sm" style={{ padding: '8px 16px' }}>Sign Up</Link>
                <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 8px' }}></div>
              </>
            )}

            <div className="lang-selector-container notranslate" role="navigation" aria-label="Language selection">
              <Globe size={16} />
              <select id="language-selector" onChange={(e) => window.changeLanguage && window.changeLanguage(e.target.value)} className="lang-select" aria-label="Select language">
                <option value="en">English</option>
                <option value="te">Telugu</option>
                <option value="hi">Hindi</option>
                {/* Keep simple list for frontend brevity, user can expand if needed */}
              </select>
            </div>

            <a href="tel:112" className="nav-sos-btn" aria-label="Emergency call 112">
              <AlertTriangle size={16} />
              <span className="notranslate">SOS</span>
            </a>

            {user && (
              <button onClick={logout} className="nav-logout-btn" aria-label="Logout" style={{ background: 'none', border: '1.5px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit' }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}

            <button className="nav-hamburger" aria-label="Open menu" aria-expanded={drawerOpen} onClick={openDrawer} style={{ background: 'none', border: 'none', padding: 0 }}>
              <Menu size={28} color="var(--text)" />
            </button>
          </div>
        </div>
      </nav>

      <div className={`nav-mobile-drawer ${drawerOpen ? 'open' : ''}`} role="navigation" aria-label="Mobile navigation" aria-hidden={!drawerOpen}>
        <button className="nav-drawer-close" aria-label="Close menu" onClick={closeDrawer}>
          <X size={24} />
        </button>

        <div style={{ marginBottom: '12px' }}>
          <Link to="/" className="nav-logo" style={{ textDecoration: 'none', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Logo size="28" />
            <span className="nav-logo-text" style={{ fontSize: '1rem' }}>Empathezee</span>
          </Link>
        </div>

        {user ? (
          <>
            {user.role === 'doctor' ? (
              <>
                <Link to="/doctor/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><ShieldHalf size={20} /> Doctor Dashboard</Link>
                <Link to="/medicine" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Pill size={20} /> Medicines</Link>
                <Link to="/analytics" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><LineChart size={20} /> Analytics</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Home size={20} /> Dashboard</Link>
                <Link to="/communities" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Users size={20} /> Communities</Link>
                <Link to="/doctor/search" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Stethoscope size={20} /> Find Doctors</Link>
                <Link to="/appointments-ui" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><CalendarCheck size={20} /> Appointments</Link>
                <Link to="/medicine" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Pill size={20} /> Medicines</Link>
                <Link to="/wellness" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Sparkles size={20} /> Mental Wellness</Link>
                <Link to="/analytics" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><LineChart size={20} /> Analytics</Link>
              </>
            )}
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
              <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger)', background: 'var(--danger-bg)', width: '100%', textAlign: 'left', border: 'none', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>
                <LogOut size={20} /> Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><LogIn size={20} /> Login</Link>
            <Link to="/register" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><UserPlus size={20} /> Sign Up</Link>
            <Link to="/doctor/login" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Stethoscope size={20} /> Doctor Login</Link>
          </>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <a href="tel:112" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger)', background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
            <AlertTriangle size={20} /> Emergency — Call 112
          </a>
        </div>
      </div>

      <div className={`nav-overlay ${drawerOpen ? 'open' : ''}`} aria-hidden={!drawerOpen} onClick={closeDrawer}></div>

      {user && user.role !== 'doctor' && (
        <nav className="mobile-bottom-nav" aria-label="Bottom navigation">
          <Link to="/dashboard" className={`mobile-nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/communities" className={`mobile-nav-item ${isActive('/communities') ? 'active' : ''}`}>
            <Users size={20} />
            <span>Community</span>
          </Link>
          <Link to="/doctor/search" className={`mobile-nav-item ${isActive('/doctor/search') ? 'active' : ''}`}>
            <Stethoscope size={20} />
            <span>Doctors</span>
          </Link>
          <Link to="/medicine" className={`mobile-nav-item ${isActive('/medicine') ? 'active' : ''}`}>
            <Pill size={20} />
            <span>Medicines</span>
          </Link>
          <Link to="/appointments-ui" className={`mobile-nav-item ${isActive('/appointments-ui') ? 'active' : ''}`}>
            <CalendarCheck size={20} />
            <span>Appts</span>
          </Link>
        </nav>
      )}
    </>
  );
};

export default Navbar;
