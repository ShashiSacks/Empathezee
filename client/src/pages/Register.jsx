import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LOCATION_DATA from '../utils/locationData';
import Logo from '../components/Logo';
import { Button, Alert } from '../components/ui';

export default function Register() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  if (searchParams.get('role') === 'doctor') {
    return <Navigate to="/doctor/register" replace />;
  }

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
    city: '',
  });

  const [stateInput, setStateInput] = useState('');
  const [districtInput, setDistrictInput] = useState('');
  const [cityInput, setCityInput] = useState('');

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setCountries(LOCATION_DATA.getCountries());
  }, []);

  const handleCountryChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      country: val,
      state: '',
      district: '',
      city: '',
    }));
    setStateInput('');
    setDistrictInput('');
    setCityInput('');

    if (LOCATION_DATA.hasDetailedData(val)) {
      setStates(LOCATION_DATA.getStates(val));
    } else {
      setStates([]);
    }
    setDistricts([]);
    setCities([]);
  };

  const handleStateChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      state: val,
      district: '',
      city: '',
    }));
    setDistrictInput('');
    setCityInput('');

    if (val) {
      setDistricts(LOCATION_DATA.getDistricts(val));
    } else {
      setDistricts([]);
    }
    setCities([]);
  };

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      district: val,
      city: '',
    }));
    setCityInput('');

    if (val) {
      setCities(LOCATION_DATA.getCities(val));
    } else {
      setCities([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      ...formData,
      state: LOCATION_DATA.hasDetailedData(formData.country) ? formData.state : stateInput,
      district: LOCATION_DATA.hasDetailedData(formData.country) ? formData.district : districtInput,
      city: LOCATION_DATA.hasDetailedData(formData.country) ? formData.city : cityInput,
    };

    try {
      await api.post('/api/auth/register', payload);
      await fetchUser();
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data) {
        const msg = typeof err.response.data === 'string' 
          ? err.response.data 
          : err.response.data.message || 'Registration failed';
        setError(msg);
      } else {
        setError('Registration failed. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isIndia = LOCATION_DATA.hasDetailedData(formData.country);

  return (
    <div className="auth-container">
      {/* left side (form) */}
      <div className="auth-left">
        <div className="auth-left-content">
          <h1 className="title" style={{ marginBottom: '24px' }}>Join the Empathezee community</h1>

          {error && (
            <Alert type="error" onDismiss={() => setError('')} style={{ marginBottom: '20px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                type="text"
                name="username"
                placeholder="Choose a username"
                required
                autoComplete="name"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                autoComplete="username"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Min. 6 characters"
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((p) => !p)}
                >
                  <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-age">Age <span className="optional-tag">(optional)</span></label>
              <input
                id="reg-age"
                type="number"
                name="age"
                placeholder="Your age"
                min="0"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                name="gender"
                id="gender"
                required
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Prefer not to say</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reg-disease">Health condition / Interest <span className="optional-tag">(optional)</span></label>
              <input
                id="reg-disease"
                type="text"
                name="disease"
                placeholder="e.g. Type 2 diabetes, Asthma…"
                value={formData.disease}
                onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
              />
            </div>

            {/* cascading location picker */}
            <div className="location-picker">
              <div className="form-group">
                <label htmlFor="country">Country <span className="optional-tag">(optional)</span></label>
                <select name="country" id="country" value={formData.country} onChange={handleCountryChange}>
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {formData.country && (
                isIndia ? (
                  <div className="form-group" id="state-group" style={{ display: 'flex' }}>
                    <label htmlFor="state">State <span className="optional-tag">(optional)</span></label>
                    <select id="state" value={formData.state} onChange={handleStateChange}>
                      <option value="">Select state</option>
                      {states.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="form-group" style={{ display: 'flex' }}>
                    <label htmlFor="state-input">State <span className="optional-tag">(optional)</span></label>
                    <input
                      type="text"
                      id="state-input"
                      placeholder="State name"
                      value={stateInput}
                      onChange={(e) => setStateInput(e.target.value)}
                    />
                  </div>
                )
              )}

              {formData.country && (
                isIndia ? (
                  formData.state && (
                    <div className="form-group" id="district-group" style={{ display: 'flex' }}>
                      <label htmlFor="district">District <span className="optional-tag">(optional)</span></label>
                      <select id="district" value={formData.district} onChange={handleDistrictChange}>
                        <option value="">Select district</option>
                        {districts.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  )
                ) : (
                  <div className="form-group" style={{ display: 'flex' }}>
                    <label htmlFor="district-input">District <span className="optional-tag">(optional)</span></label>
                    <input
                      type="text"
                      id="district-input"
                      placeholder="District name"
                      value={districtInput}
                      onChange={(e) => setDistrictInput(e.target.value)}
                    />
                  </div>
                )
              )}

              {formData.country && (
                isIndia ? (
                  formData.district && (
                    <div className="form-group" id="city-group" style={{ display: 'flex' }}>
                      <label htmlFor="city">City / Place <span className="optional-tag">(optional)</span></label>
                      <select id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}>
                        <option value="">Select city</option>
                        {cities.map((ct) => (
                          <option key={ct} value={ct}>{ct}</option>
                        ))}
                      </select>
                    </div>
                  )
                ) : (
                  <div className="form-group" style={{ display: 'flex' }}>
                    <label htmlFor="city-input">City / Place <span className="optional-tag">(optional)</span></label>
                    <input
                      type="text"
                      id="city-input"
                      placeholder="City or place"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                    />
                  </div>
                )
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              id="register-submit-btn"
              style={{ marginTop: '4px' }}
            >
              {loading ? 'Creating account…' : 'Create patient account'}
            </Button>
          </form>

          <div className="auth-footer-container">
            <p className="auth-footer-text">
              Already part of Empathezee?{' '}
              <Link to="/login" className="auth-action-link">
                Sign in to account <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.75rem' }}></i>
              </Link>
            </p>
            <p className="auth-footer-text">
              Medical Practitioner?{' '}
              <Link to="/doctor/register" className="auth-action-link accent">
                Doctor registration <i className="fa-solid fa-user-doctor" style={{ fontSize: '0.75rem' }}></i>
              </Link>
              {' · '}
              <Link to="/doctor/login" className="auth-action-link accent">
                Doctor sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side image */}
      <div className="auth-right">
        <div className="auth-right-content-wrapper">
          <div className="auth-right-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Logo size="36" />
            <span className="auth-logo-text" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>Empathezee</span>
          </div>
          <h2 className="auth-right-title">Compassionate healthcare support, built around you.</h2>
          <p className="auth-right-subtitle">Exchange treatment insights with real patients, consult verified medical specialists, and access private wellness resources.</p>

          <div className="auth-feature-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
            {[
              { icon: 'fa-solid fa-people-group',  label: 'Condition-based support communities' },
              { icon: 'fa-solid fa-user-doctor',    label: 'Verified medical specialist network' },
              { icon: 'fa-solid fa-shield-halved',  label: 'Privacy-first patient platform' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="auth-feature-item"
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '9px', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={icon} style={{ fontSize: '1rem' }} />
                </div>
                <span style={{ fontWeight: 500, fontSize: '1rem', color: 'white' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
