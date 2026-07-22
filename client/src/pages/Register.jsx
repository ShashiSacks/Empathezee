import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LOCATION_DATA from '../utils/locationData';
import Logo from '../components/Logo';
import { Button, Alert } from '../components/ui';

export default function Register() {
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
      navigate('/login');
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
          <h1 className="title" style={{ marginBottom: '6px' }}>Create your account</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>Free forever — no credit card required</p>

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
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Rather not to say</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reg-disease">Health condition / Disease <span className="optional-tag">(optional)</span></label>
              <input
                id="reg-disease"
                type="text"
                name="disease"
                placeholder="e.g. Diabetes, Lupus, MS…"
                value={formData.disease}
                onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
              />
            </div>

            {/* cascading location picker */}
            <div className="location-picker">
              <div className="form-group">
                <label htmlFor="country">Country <span className="optional-tag">(optional)</span></label>
                <select name="country" id="country" value={formData.country} onChange={handleCountryChange}>
                  <option value="">Select Country</option>
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
                      <option value="">Select State</option>
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
                      placeholder="Type State"
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
                        <option value="">Select District</option>
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
                      placeholder="Type District"
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
                        <option value="">Select City</option>
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
                      placeholder="Type City / Place"
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
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p>
              Already have an account?{' '}
              <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary)' }}>Sign in</Link>
            </p>
            <p>
              Registering as a doctor?{' '}
              <Link to="/doctor/register" style={{ fontWeight: 600, color: 'var(--accent)' }}>Doctor registration</Link>
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
          <h2 className="auth-right-title">You don't have to fight your illness alone.</h2>
          <p className="auth-right-subtitle">Connect with patients who understand, share experiences, consult verified doctors, and access curated health tracking tools.</p>

          <div className="auth-feature-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
            {[
              { icon: 'fa-solid fa-people-group',  label: 'Disease-Based Support Communities' },
              { icon: 'fa-solid fa-user-doctor',    label: 'Verified Medical Specialists' },
              { icon: 'fa-solid fa-shield-halved',  label: 'Private & Secure Platform' },
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
