import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LOCATION_DATA from '../utils/locationData';

export default function Profile() {
  const { user, fetchUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    gender: 'male',
    disease: '',
    country: '',
    state: '',
    district: '',
    city: '',
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCountries(LOCATION_DATA.getCountries());
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        age: user.age || '',
        gender: user.gender || 'male',
        disease: user.disease || '',
        country: user.country || '',
        state: user.state || '',
        district: user.district || '',
        city: user.city || '',
      });
      if (user.country && LOCATION_DATA.hasDetailedData(user.country)) {
        setStates(LOCATION_DATA.getStates(user.country));
        if (user.state) {
          setDistricts(LOCATION_DATA.getDistricts(user.state));
          if (user.district) {
            setCities(LOCATION_DATA.getCities(user.district));
          }
        }
      }
    }
  }, [user]);

  const handleCountryChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, country: val, state: '', district: '', city: '' }));
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
    setFormData((prev) => ({ ...prev, state: val, district: '', city: '' }));
    if (val) {
      setDistricts(LOCATION_DATA.getDistricts(val));
    } else {
      setDistricts([]);
    }
    setCities([]);
  };

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, district: val, city: '' }));
    if (val) {
      setCities(LOCATION_DATA.getCities(val));
    } else {
      setCities([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('');

    try {
      await api.post('/api/users/profile', formData);
      await fetchUser();
      setStatusMsg('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const locationParts = [user?.city, user?.district, user?.state, user?.country].filter(Boolean);

  return (
    <main className="page-container">
      <h1 className="title">User Profile</h1>

      {statusMsg && (
        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius)', background: 'var(--secondary-50)', color: 'var(--secondary-dark)', marginBottom: '24px', textAlign: 'center', fontWeight: 600 }}>
          {statusMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        {/* left column: profile details */}
        <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
          <h2 style={{ textAlign: 'center' }}>👤 {user?.username}</h2>
          <div className="profile-details" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '25px' }}>
            <p style={{ textAlign: 'left' }}><b>Email:</b> {user?.email}</p>
            <p style={{ textAlign: 'left' }}><b>Age:</b> {user?.age || 'Not set'}</p>
            <p style={{ textAlign: 'left', textTransform: 'capitalize' }}><b>Gender:</b> {user?.gender || 'Not set'}</p>
            <p style={{ textAlign: 'left' }}><b>Location:</b> {locationParts.length > 0 ? locationParts.join(', ') : 'Not set'}</p>
            <p style={{ textAlign: 'left' }}><b>Target Disease:</b> {user?.disease || 'Not set'}</p>
          </div>
        </div>

        {/* right column: edit form */}
        <div className="card" style={{ margin: 0, textAlign: 'left' }}>
          <h2 style={{ textAlign: 'center' }}>✏️ Edit Details</h2>
          <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label htmlFor="username" style={{ fontWeight: 600 }}>Username</label>
              <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
            </div>

            <div className="form-group">
              <label htmlFor="email" style={{ fontWeight: 600 }}>Email Address</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            <div className="form-group">
              <label htmlFor="age" style={{ fontWeight: 600 }}>Age</label>
              <input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} placeholder="e.g. 25" />
            </div>

            <div className="form-group">
              <label htmlFor="gender" style={{ fontWeight: 600 }}>Gender</label>
              <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="disease" style={{ fontWeight: 600 }}>Target Disease / Indication</label>
              <input type="text" value={formData.disease} onChange={(e) => setFormData({ ...formData, disease: e.target.value })} placeholder="e.g. Asthma" />
            </div>

            <div className="location-picker">
              <div className="form-group">
                <label htmlFor="profile-country" style={{ fontWeight: 600 }}>Country</label>
                <select id="profile-country" value={formData.country} onChange={handleCountryChange}>
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {formData.country && LOCATION_DATA.hasDetailedData(formData.country) && (
                <div className="form-group">
                  <label htmlFor="profile-state" style={{ fontWeight: 600 }}>State</label>
                  <select id="profile-state" value={formData.state} onChange={handleStateChange}>
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              {formData.state && LOCATION_DATA.hasDetailedData(formData.country) && (
                <div className="form-group">
                  <label htmlFor="profile-district" style={{ fontWeight: 600 }}>District</label>
                  <select id="profile-district" value={formData.district} onChange={handleDistrictChange}>
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

              {formData.district && LOCATION_DATA.hasDetailedData(formData.country) && (
                <div className="form-group">
                  <label htmlFor="profile-city" style={{ fontWeight: 600 }}>City / Place</label>
                  <select id="profile-city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}>
                    <option value="">Select City</option>
                    {cities.map((ct) => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>

      <h2>👥 Joined Communities</h2>

      {!user?.communities || user.communities.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">👥</span>
          <h3>No Communities Joined</h3>
          <p>Explore community directory and join support groups matching your condition.</p>
          <Link to="/communities" className="btn-primary" style={{ marginTop: '14px' }}>Explore Communities</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '20px' }}>
          {user.communities.map((c) => (
            <div key={c._id || c} className="card" style={{ padding: '20px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px' }}>{c.name || 'Community'}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 12px' }}>{c.disease}</p>
              <Link to={`/community/${c._id || c}`} className="btn-primary btn-sm">Enter Community</Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
