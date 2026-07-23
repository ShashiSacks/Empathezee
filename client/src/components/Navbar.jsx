import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import {
  Home,
  Users,
  UserCheck,
  Calendar,
  Pill,
  HeartPulse,
  BarChart3,
  Stethoscope,
  LogOut,
  LogIn,
  UserPlus,
  Globe,
  PhoneCall,
  Menu,
  X
} from 'lucide-react';

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
            <Logo size={32} />
            <span className="nav-logo-text">Empathezee</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-links" id="desktop-nav">
            {user ? (
              user.role === 'doctor' ? (
                <>
                  <Link to="/doctor/dashboard" id="nav-doctor-dashboard" className={isActive('/doctor/dashboard') ? 'active' : ''}>
                    <Stethoscope className="w-4 h-4 mr-1.5 inline-block" /> Doctor Dashboard
                  </Link>
                  <Link to="/medicine" id="nav-medicines-dr" className={isActive('/medicine') ? 'active' : ''}>
                    <Pill className="w-4 h-4 mr-1.5 inline-block" /> Medicines
                  </Link>
                  <Link to="/analytics" id="nav-analytics-dr" className={isActive('/analytics') ? 'active' : ''}>
                    <BarChart3 className="w-4 h-4 mr-1.5 inline-block" /> Analytics
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" id="nav-dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                    <Home className="w-4 h-4 mr-1.5 inline-block" /> Dashboard
                  </Link>
                  <Link to="/communities" id="nav-communities" className={isActive('/communities') ? 'active' : ''}>
                    <Users className="w-4 h-4 mr-1.5 inline-block" /> Communities
                  </Link>
                  <Link to="/doctor/search" id="nav-doctors" className={isActive('/doctor/search') ? 'active' : ''}>
                    <UserCheck className="w-4 h-4 mr-1.5 inline-block" /> Find Doctors
                  </Link>
                  <Link to="/appointments-ui" id="nav-appointments" className={isActive('/appointments-ui') ? 'active' : ''}>
                    <Calendar className="w-4 h-4 mr-1.5 inline-block" /> Appointments
                  </Link>
                  <Link to="/medicine" id="nav-medicines" className={isActive('/medicine') ? 'active' : ''}>
                    <Pill className="w-4 h-4 mr-1.5 inline-block" /> Medicines
                  </Link>
                  <Link to="/wellness" id="nav-wellness" className={isActive('/wellness') ? 'active' : ''}>
                    <HeartPulse className="w-4 h-4 mr-1.5 inline-block" /> Wellness
                  </Link>
                  <Link to="/analytics" id="nav-analytics" className={isActive('/analytics') ? 'active' : ''}>
                    <BarChart3 className="w-4 h-4 mr-1.5 inline-block" /> Analytics
                  </Link>
                </>
              )
            ) : (
              <>
                <Link to="/login" id="nav-login" className={isActive('/login') ? 'active' : ''}>
                  <LogIn className="w-4 h-4 mr-1.5 inline-block" /> Login
                </Link>
                <Link to="/register" id="nav-register" className={isActive('/register') ? 'active' : ''}>
                  <UserPlus className="w-4 h-4 mr-1.5 inline-block" /> Register
                </Link>
                <Link to="/doctor/login" id="nav-doctor-login" className={isActive('/doctor/login') ? 'active' : ''}>
                  <Stethoscope className="w-4 h-4 mr-1.5 inline-block" /> Doctor Portal
                </Link>
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="nav-actions">
            {/* Language Selector */}
            <div className="lang-selector-container notranslate" role="navigation" aria-label="Language selection">
              <Globe className="w-4 h-4 lang-icon" aria-hidden="true" />
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
                <option value="zh-CN">Chinese (简体)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
                <option value="es">Español</option>
              </select>
            </div>

            {/* Emergency Call Button */}
            <a href="tel:112" className="nav-sos-btn" id="nav-sos" aria-label="Emergency call 112">
              <PhoneCall className="w-3.5 h-3.5 mr-1" />
              <span className="notranslate">112 SOS</span>
            </a>

            {/* Logout Button */}
            {user && (
              <button onClick={logout} className="nav-logout-btn" id="nav-logout" aria-label="Logout">
                <LogOut className="w-4 h-4 mr-1.5 inline-block" />
                <span>Logout</span>
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              className="nav-hamburger"
              id="hamburger-btn"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileOpen}
              onClick={() => toggleMobileDrawer(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div className={`nav-mobile-drawer ${mobileOpen ? 'open' : ''}`} id="mobile-drawer" role="navigation" aria-label="Mobile navigation">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-semibold text-slate-900 text-lg">Empathezee</span>
          </div>
          <button className="p-2 text-slate-500 hover:text-slate-900" onClick={() => toggleMobileDrawer(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          {user ? (
            user.role === 'doctor' ? (
              <>
                <Link to="/doctor/dashboard" onClick={() => toggleMobileDrawer(false)} className="mob-drawer-link">
                  <Stethoscope className="w-4 h-4" /> Doctor Dashboard
                </Link>
                <Link to="/medicine" onClick={() => toggleMobileDrawer(false)} className="mob-drawer-link">
                  <Pill className="w-4 h-4" /> Medicines
                </Link>
                <Link to="/analytics" onClick={() => toggleMobileDrawer(false)} className="mob-drawer-link">
                  <BarChart3 className="w-4 h-4" /> Analytics
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" onClick={() => toggleMobileDrawer(false)} className="mob-drawer-link">
                  <Home className="w-4 h-4" /> Dashboard
                </Link>
                <Link to="/communities" onClick={() => toggleMobileDrawer(false)} className="mob-drawer-link">
                  <Users className="w-4 h-4" /> Communities
                </Link>
                <Link to="/doctor/search" onClick={() => toggleMobileDrawer(false)} className="mob-drawer-link">
                  <UserCheck className="w-4 h-4" /> Find Doctors
                </Link>
                <Link to="/appointments-ui" onClick={() => toggleMobileDrawer(false)} className="mob-drawer-link">
                  <Calendar className="w-4 h-4" /> Appointments
                </Link>
                <Link to="/medicine" onClick={() => toggleMobileDrawer(false)} className="mob-drawer-link">
                  <Pill className="w-4 h-4" /> Medicines
                </Link>
                <Link to="/wellness" onClick={() => toggleMobileDrawer(false)} className="mob-drawer-link">
                  <HeartPulse className="w-4 h-4" /> Mental Wellness
                </Link>
                <Link to="/analytics" onClick={() => toggleMobileDrawer(false)} className="mob-drawer-link">
                  <BarChart3 className="w-4 h-4" /> Analytics
                </Link>
              </>
            )
          ) : (
            <>
              <Link to="/login" onClick={() => toggleMobileDrawer(false)} className="mob-drawer-link">
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link to="/register" onClick={() => toggleMobileDrawer(false)} className="mob-drawer-link">
                <UserPlus className="w-4 h-4" /> Register
              </Link>
              <Link to="/doctor/login" onClick={() => toggleMobileDrawer(false)} className="mob-drawer-link">
                <Stethoscope className="w-4 h-4" /> Doctor Portal
              </Link>
            </>
          )}

          {user && (
            <button onClick={() => { toggleMobileDrawer(false); logout(); }} className="mob-drawer-logout">
              <LogOut className="w-4 h-4" /> Logout Account
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="nav-overlay open" onClick={() => toggleMobileDrawer(false)}></div>
      )}

      {/* Mobile Bottom Navigation */}
      {user && user.role !== 'doctor' && (
        <nav className="mobile-bottom-nav" aria-label="Bottom navigation">
          <Link to="/dashboard" className={`mobile-nav-item ${isActive('/dashboard') ? 'active' : ''}`} id="mob-bottom-dashboard">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link to="/communities" className={`mobile-nav-item ${isActive('/communities') ? 'active' : ''}`} id="mob-bottom-communities">
            <Users className="w-5 h-5" />
            <span>Community</span>
          </Link>
          <Link to="/doctor/search" className={`mobile-nav-item ${isActive('/doctor/search') ? 'active' : ''}`} id="mob-bottom-doctors">
            <UserCheck className="w-5 h-5" />
            <span>Doctors</span>
          </Link>
          <Link to="/medicine" className={`mobile-nav-item ${isActive('/medicine') ? 'active' : ''}`} id="mob-bottom-medicine">
            <Pill className="w-5 h-5" />
            <span>Medicines</span>
          </Link>
          <Link to="/appointments-ui" className={`mobile-nav-item ${isActive('/appointments-ui') ? 'active' : ''}`} id="mob-bottom-appts">
            <Calendar className="w-5 h-5" />
            <span>Appts</span>
          </Link>
        </nav>
      )}
    </>
  );
}
