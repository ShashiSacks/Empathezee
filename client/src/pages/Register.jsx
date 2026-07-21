import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LOCATION_DATA from '../utils/locationData';

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
        setError(typeof err.response.data === 'string' ? err.response.data : 'Registration failed');
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
      <div className="auth-left" style={{ overflowY: 'auto', paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="auth-left-content">
          <h1 className="title">Register</h1>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius)', background: 'var(--danger-bg)', color: 'var(--danger)', marginBottom: '16px', fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              min="0"
              max="120"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />

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

            <input
              type="text"
              name="disease"
              placeholder="Disease"
              value={formData.disease}
              onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
            />

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

            <button type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p>
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>

          <p>
            Registering as a doctor?{' '}
            <Link to="/doctor/register">Doctor registration</Link>
          </p>

          {/* google login button */}
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '15px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }}></div>
              <span style={{ padding: '0 10px', fontWeight: 550, textTransform: 'uppercase' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }}></div>
            </div>
            <a
              href="/auth/google"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                width: '100%',
                border: '1.5px solid var(--line)',
                borderRadius: 'var(--radius)',
                padding: '12px 16px',
                fontWeight: 600,
                textDecoration: 'none',
                color: 'var(--text)',
                background: 'var(--surface)',
                transition: 'background-color 0.2s, border-color 0.2s',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-warm)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface)';
                e.currentTarget.style.borderColor = 'var(--line)';
              }}
            >
              <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.336 0 3.327 2.673 1.327 6.573L5.266 9.765z" />
                <path fill="#4285F4" d="M23.491 12.273c0-.818-.073-1.609-.209-2.373H12v4.509h6.445c-.277 1.482-1.11 2.736-2.364 3.582l3.864 2.99A11.896 11.896 0 0 0 23.491 12.273z" />
                <path fill="#FBBC05" d="M5.266 14.235A7.127 7.127 0 0 1 4.909 12c0-.79.136-1.545.357-2.235L1.327 6.573A11.97 11.97 0 0 0 0 12c0 2.018.5 3.927 1.382 5.618l3.884-3.383z" />
                <path fill="#34A853" d="M12 24c3.245 0 5.973-1.073 7.964-2.91l-3.864-2.99C15.027 18.782 13.627 19.09 12 19.09c-3.155 0-5.818-2.127-6.773-4.99L1.345 17.482C3.355 21.355 7.355 24 12 24z" />
              </svg>
              Continue with Google
            </a>
          </div>
        </div>
      </div>

      {/* right side image */}
      <div className="auth-right">
        <div className="auth-right-content-wrapper">
          <div className="auth-right-logo">
            <span className="auth-logo-icon"><i className="fa-solid fa-heart-pulse"></i></span>
            <span className="auth-logo-text">Empathezee</span>
          </div>
          <h2 className="auth-right-title">You don't have to fight your illness alone.</h2>
          <p className="auth-right-subtitle">Connect with patients who understand, share experiences, consult verified doctors, and access curated health tracking tools.</p>
          <div className="auth-right-stats">
            <div className="auth-stat-item">
              <span className="auth-stat-num">10k+</span>
              <span className="auth-stat-lbl">Active Peers</span>
            </div>
            <div className="auth-stat-item">
              <span className="auth-stat-num">250+</span>
              <span className="auth-stat-lbl">Verified Doctors</span>
            </div>
            <div className="auth-stat-item">
              <span className="auth-stat-num">50+</span>
              <span className="auth-stat-lbl">Support Groups</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
