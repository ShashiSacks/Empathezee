import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LOCATION_DATA from '../utils/locationData';

export default function DoctorRegister() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    disease: '',
    bio: '',
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
      await api.post('/api/auth/doctor/register', payload);
      navigate('/doctor/login');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Registration failed');
      } else {
        setError('Doctor registration failed. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isIndia = LOCATION_DATA.hasDetailedData(formData.country);

  return (
    <div className="auth-container">
      {/* left side (form area) */}
      <div className="auth-left" style={{ overflowY: 'auto', paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="auth-left-content">
          <h1 className="title">Doctor Register</h1>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius)', background: 'var(--danger-bg)', color: 'var(--danger)', marginBottom: '16px', fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Full name"
              required
              autoComplete="name"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />

            <input
              type="email"
              name="email"
              placeholder="Doctor email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              min="18"
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
              placeholder="Specialization"
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

            <textarea
              name="bio"
              placeholder="Short professional bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            ></textarea>

            <button type="submit" disabled={loading}>
              {loading ? 'Creating Doctor Account...' : 'Create Doctor Account'}
            </button>
          </form>

          <p>
            Already registered?{' '}
            <Link to="/doctor/login">Doctor login</Link>
          </p>

          <p>
            Patient account?{' '}
            <Link to="/register">Patient registration</Link>
          </p>
        </div>
      </div>

      {/* right side image */}
      <div className="auth-right">
        <div className="auth-right-content-wrapper">
          <div className="auth-right-logo">
            <span className="auth-logo-icon"><i className="fa-solid fa-heart-pulse"></i></span>
            <span className="auth-logo-text">Empathezee Pro</span>
          </div>
          <h2 className="auth-right-title">Empower patients, guide support groups.</h2>
          <p className="auth-right-subtitle">Join our verified network of medical specialists. Moderate discussions, host online consultations, and help patients manage chronic conditions.</p>
          <div className="auth-right-stats">
            <div className="auth-stat-item">
              <span className="auth-stat-num">24/7</span>
              <span className="auth-stat-lbl">Care Guidance</span>
            </div>
            <div className="auth-stat-item">
              <span className="auth-stat-num">15k+</span>
              <span className="auth-stat-lbl">Patient Interactions</span>
            </div>
            <div className="auth-stat-item">
              <span className="auth-stat-num">100%</span>
              <span className="auth-stat-lbl">Verified Specialists</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
