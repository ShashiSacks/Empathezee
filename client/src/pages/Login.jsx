import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Users, Stethoscope, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { checkAuth, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);
      
      await axios.post('/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      await checkAuth();
      
    } catch (err) {
      if (err.response && typeof err.response.data === 'string') {
        setError(err.response.data);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-left-content">
          <h1 className="title" style={{ fontSize: '2rem', marginBottom: '24px' }}>Welcome Back</h1>

          {error && <div className="error-message" style={{ color: 'var(--danger)', marginBottom: '24px', background: 'var(--danger-bg)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="you@example.com" 
                required 
                autoComplete="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="••••••••" 
                required 
                autoComplete="current-password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px', padding: '14px' }}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '12px' }}>
              Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</Link>
            </p>
            <p>
              Are you a doctor? <Link to="/doctor/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Doctor portal</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-content-wrapper">
          <div className="auth-right-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Logo size="36" />
            <span className="auth-logo-text" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>Empathezee</span>
          </div>
          <h2 className="auth-right-title">You don't have to fight your illness alone.</h2>
          <p className="auth-right-subtitle">Connect with patients who understand, share experiences, consult verified doctors, and access curated health tracking tools.</p>
          
          <div className="auth-feature-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
            <FeatureItem icon={<Users size={20} />} text="Support Communities" />
            <FeatureItem icon={<Stethoscope size={20} />} text="Verified Doctors" />
            <FeatureItem icon={<ShieldCheck size={20} />} text="Private & Secure" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, text }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div 
      className="auth-feature-item" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        padding: '12px 16px', 
        background: hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)', 
        borderRadius: '12px', 
        backdropFilter: 'blur(8px)', 
        border: '1px solid rgba(255,255,255,0.05)', 
        transition: 'background 0.3s' 
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <span style={{ fontWeight: '500', fontSize: '1.05rem', color: 'white' }}>{text}</span>
    </div>
  );
};

export default Login;
