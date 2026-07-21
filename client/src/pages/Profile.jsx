import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Navigation, Activity, Save, Users, ArrowLeft, HeartPulse } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useAuth();
  
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    age: '',
    gender: 'other',
    disease: '',
    country: '',
    state: '',
    district: '',
    city: ''
  });
  
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [locationOptions, setLocationOptions] = useState({
    countries: [],
    states: [],
    districts: [],
    cities: []
  });

  const [locationMode, setLocationMode] = useState({
    state: 'none', 
    district: 'none',
    city: 'none'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [profileRes, commsRes] = await Promise.all([
        axios.get('/api/users/profile'),
        axios.get('/api/users/communities')
      ]);
      
      const userData = profileRes.data.user || {};
      
      setProfileData({
        username: userData.username || '',
        email: userData.email || '',
        age: userData.age || '',
        gender: userData.gender || 'other',
        disease: userData.disease || '',
        country: userData.country || '',
        state: userData.state || '',
        district: userData.district || '',
        city: userData.city || ''
      });
      
      setCommunities(commsRes.data || []);
      
      // Initialize location data if script is loaded
      if (window.LOCATION_DATA) {
        initLocation(userData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initLocation = (userData) => {
    const countries = window.LOCATION_DATA.getCountries();
    setLocationOptions(prev => ({ ...prev, countries }));
    
    if (userData.country && window.LOCATION_DATA.hasDetailedData(userData.country)) {
      const states = window.LOCATION_DATA.getStates(userData.country);
      setLocationOptions(prev => ({ ...prev, states }));
      setLocationMode(prev => ({ ...prev, state: 'select' }));
      
      if (userData.state) {
        const districts = window.LOCATION_DATA.getDistricts(userData.state);
        setLocationOptions(prev => ({ ...prev, districts }));
        setLocationMode(prev => ({ ...prev, district: 'select' }));
        
        if (userData.district) {
          const cities = window.LOCATION_DATA.getCities(userData.district);
          setLocationOptions(prev => ({ ...prev, cities }));
          setLocationMode(prev => ({ ...prev, city: 'select' }));
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setProfileData(prev => ({ ...prev, country, state: '', district: '', city: '' }));
    
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
    setProfileData(prev => ({ ...prev, state, district: '', city: '' }));
    
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
    setProfileData(prev => ({ ...prev, district, city: '' }));
    
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
    setSaving(true);
    try {
      // Send as application/json
      const response = await axios.post('/api/users/profile', profileData);
      // Update global context
      setUser(response.data);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="page-container" style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px', borderTopColor: 'var(--primary)' }}></div>
      </main>
    );
  }

  const locationString = [profileData.city, profileData.district, profileData.state, profileData.country]
    .filter(Boolean)
    .join(', ');

  return (
    <main className="page-container" style={{ paddingTop: '40px', paddingBottom: '64px' }}>
      <h1 className="title" style={{ textAlign: 'center', marginBottom: '40px' }}>User Profile</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '48px', alignItems: 'start' }}>
        
        {/* Left column: current details */}
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '16px' }}>
              <User size={40} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text)' }}>{profileData.username}</h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--bg-warm)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
              <HeartPulse size={14} style={{ color: 'var(--primary)' }} /> Patient Account
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <Mail size={18} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500 }}>{profileData.email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                  <Calendar size={18} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Age</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500 }}>{profileData.age || "Not set"}</p>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                  <User size={18} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gender</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500, textTransform: 'capitalize' }}>{profileData.gender || "Not set"}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Activity size={18} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Target Disease</p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500 }}>{profileData.disease || "Not set"}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <Navigation size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{locationString || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Edit Details Form */}
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--primary-50)', color: 'var(--primary)', padding: '8px', borderRadius: '8px' }}>
              <Save size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Edit Details</h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" name="username" id="username" value={profileData.username} onChange={handleInputChange} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" name="email" id="email" value={profileData.email} onChange={handleInputChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input type="number" name="age" id="age" value={profileData.age} onChange={handleInputChange} placeholder="e.g., 21" />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select name="gender" id="gender" value={profileData.gender} onChange={handleInputChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="disease">Target Disease / Indication</label>
              <input type="text" name="disease" id="disease" value={profileData.disease} onChange={handleInputChange} placeholder="e.g., Asthma" />
            </div>

            {/* Location Picker */}
            <div className="location-picker" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', background: 'var(--bg-warm)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div className="form-group">
                <label htmlFor="profile-country">Country</label>
                <select name="country" id="profile-country" value={profileData.country} onChange={handleCountryChange}>
                  <option value="">Select Country</option>
                  {locationOptions.countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {locationMode.state !== 'none' && (
                <div className="form-group">
                  <label htmlFor="profile-state">State</label>
                  {locationMode.state === 'select' ? (
                    <select name="state" id="profile-state" value={profileData.state} onChange={handleStateChange}>
                      <option value="">Select State</option>
                      {locationOptions.states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input type="text" name="state" placeholder="Type State" value={profileData.state} onChange={handleInputChange} />
                  )}
                </div>
              )}

              {locationMode.district !== 'none' && (
                <div className="form-group">
                  <label htmlFor="profile-district">District</label>
                  {locationMode.district === 'select' ? (
                    <select name="district" id="profile-district" value={profileData.district} onChange={handleDistrictChange}>
                      <option value="">Select District</option>
                      {locationOptions.districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  ) : (
                    <input type="text" name="district" placeholder="Type District" value={profileData.district} onChange={handleInputChange} />
                  )}
                </div>
              )}

              {locationMode.city !== 'none' && (
                <div className="form-group">
                  <label htmlFor="profile-city">City / Place</label>
                  {locationMode.city === 'select' ? (
                    <select name="city" id="profile-city" value={profileData.city} onChange={handleInputChange}>
                      <option value="">Select City</option>
                      {locationOptions.cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input type="text" name="city" placeholder="Type City" value={profileData.city} onChange={handleInputChange} />
                  )}
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={saving}>
              {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--primary-50)', color: 'var(--primary)', padding: '10px', borderRadius: '10px' }}>
          <Users size={24} />
        </div>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Joined Communities</h2>
      </div>

      {communities.length === 0 ? (
        <div className="card" style={{ padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <Users size={48} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>No Communities Joined</h3>
          <p style={{ color: 'var(--text-secondary)' }}>You have not joined any medical support communities yet. Head over to the communities directory to find one.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {communities.map(c => (
            <div key={c._id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '1.15rem', color: 'var(--text)' }}>{c.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <Activity size={14} /> <span>Target: <b style={{ color: 'var(--text)' }}>{c.disease}</b></span>
                </div>
              </div>
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <Link to={`/community/${c._id}`} className="btn-outline btn-block" style={{ display: 'flex', justifyContent: 'center' }}>Enter Group</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Centered back to dashboard link */}
      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <Link to="/dashboard" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    </main>
  );
};

export default Profile;
