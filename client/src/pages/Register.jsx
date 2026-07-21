import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Users, Stethoscope, ShieldCheck } from 'lucide-react';

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    disease: '',
    country: '',
    state: '',
    district: '',
    city: ''
  });

  const [locationOptions, setLocationOptions] = useState({
    countries: [],
    states: [],
    districts: [],
    cities: []
  });

  const [locationMode, setLocationMode] = useState({
    state: 'none', // 'none', 'select', 'input'
    district: 'none',
    city: 'none'
  });

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard');
    }
  }, [user, navigate]);

  // Initialize countries
  useEffect(() => {
    if (window.LOCATION_DATA) {
      setLocationOptions(prev => ({ ...prev, countries: window.LOCATION_DATA.getCountries() }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setFormData(prev => ({ ...prev, country, state: '', district: '', city: '' }));
    
    if (!country) {
      setLocationMode({ state: 'none', district: 'none', city: 'none' });
      setLocationOptions(prev => ({ ...prev, states: [], districts: [], cities: [] }));
    } else if (window.LOCATION_DATA && window.LOCATION_DATA.hasDetailedData(country)) {
      const states = window.LOCATION_DATA.getStates(country);
      setLocationOptions(prev => ({ ...prev, states, districts: [], cities: [] }));
      setLocationMode({ state: 'select', district: 'none', city: 'none' });
    } else {
      setLocationMode({ state: 'input', district: 'input', city: 'input' });
    }
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setFormData(prev => ({ ...prev, state, district: '', city: '' }));
    
    if (state && locationMode.state === 'select') {
      const districts = window.LOCATION_DATA.getDistricts(state);
      setLocationOptions(prev => ({ ...prev, districts, cities: [] }));
      setLocationMode(prev => ({ ...prev, district: 'select', city: 'none' }));
    } else if (locationMode.state === 'select') {
      setLocationMode(prev => ({ ...prev, district: 'none', city: 'none' }));
    }
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setFormData(prev => ({ ...prev, district, city: '' }));
    
    if (district && locationMode.district === 'select') {
      const cities = window.LOCATION_DATA.getCities(district);
      setLocationOptions(prev => ({ ...prev, cities }));
      setLocationMode(prev => ({ ...prev, city: 'select' }));
    } else if (locationMode.district === 'select') {
      setLocationMode(prev => ({ ...prev, city: 'none' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = new URLSearchParams();
      Object.keys(formData).forEach(key => {
        if (formData[key]) payload.append(key, formData[key]);
      });

      await axios.post('/api/auth/register', payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      // Backend returns 302 to /login on success
      navigate('/login');

    } catch (err) {
      if (err.response && typeof err.response.data === 'string') {
        setError(err.response.data);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-left-content" style={{ padding: '32px 0' }}>
          <h1 className="title" style={{ fontSize: '2rem', marginBottom: '24px' }}>Create Account</h1>

          {error && <div className="error-message" style={{ color: 'var(--danger)', marginBottom: '24px', background: 'var(--danger-bg)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="johndoe" required value={formData.username} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" placeholder="e.g. 28" min="0" max="120" value={formData.age} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="you@example.com" required value={formData.email} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="••••••••" required value={formData.password} onChange={handleInputChange} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select name="gender" id="gender" required value={formData.gender} onChange={handleInputChange}>
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Rather not to say</option>
                </select>
              </div>

              <div className="form-group">
                <label>Disease / Condition</label>
                <input type="text" name="disease" placeholder="e.g. Diabetes" value={formData.disease} onChange={handleInputChange} />
              </div>
            </div>

            <div className="location-picker" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', background: 'var(--bg-warm)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>Location Details</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Help us connect you with nearby communities</p>
              
              <div className="form-group">
                <label htmlFor="country">Country <span className="optional-tag" style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '0.8rem' }}>(optional)</span></label>
                <select name="country" id="country" value={formData.country} onChange={handleCountryChange}>
                  <option value="">Select Country</option>
                  {locationOptions.countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {locationMode.state !== 'none' && (
                <div className="form-group">
                  <label htmlFor="state">State <span className="optional-tag" style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '0.8rem' }}>(optional)</span></label>
                  {locationMode.state === 'select' ? (
                    <select name="state" value={formData.state} onChange={handleStateChange}>
                      <option value="">Select State</option>
                      {locationOptions.states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input type="text" name="state" placeholder="Type State" value={formData.state} onChange={handleInputChange} />
                  )}
                </div>
              )}

              {locationMode.district !== 'none' && (
                <div className="form-group">
                  <label htmlFor="district">District <span className="optional-tag" style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '0.8rem' }}>(optional)</span></label>
                  {locationMode.district === 'select' ? (
                    <select name="district" value={formData.district} onChange={handleDistrictChange}>
                      <option value="">Select District</option>
                      {locationOptions.districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  ) : (
                    <input type="text" name="district" placeholder="Type District" value={formData.district} onChange={handleInputChange} />
                  )}
                </div>
              )}

              {locationMode.city !== 'none' && (
                <div className="form-group">
                  <label htmlFor="city">City / Place <span className="optional-tag" style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '0.8rem' }}>(optional)</span></label>
                  {locationMode.city === 'select' ? (
                    <select name="city" value={formData.city} onChange={handleInputChange}>
                      <option value="">Select City</option>
                      {locationOptions.cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input type="text" name="city" placeholder="Type City / Place" value={formData.city} onChange={handleInputChange} />
                  )}
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px', padding: '14px' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '12px' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login here</Link>
            </p>
            <p>
              Are you a doctor? <Link to="/doctor/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Doctor registration</Link>
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

export default Register;
