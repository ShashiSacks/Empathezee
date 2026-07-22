import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LOCATION_DATA from '../utils/locationData';
import { Container, Card, FormGroup, Input, Select, Button, PageHeader } from '../components/ui';

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
    <main style={{ flex: 1 }}>
      <PageHeader
        badge={<><i className="fa-solid fa-user-gear"></i> Account Settings</>}
        title="User"
        highlight="Profile"
        subtitle="Manage your personal details, location preferences, disease indication, and joined support communities."
        gradient="primary"
      />

      <Container size="xl">
        {statusMsg && (
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius)', background: 'var(--secondary-50)', color: 'var(--secondary-dark)', marginBottom: 'var(--space-6)', textAlign: 'center', fontWeight: 600 }}>
            {statusMsg}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-8)', marginBottom: 'var(--space-10)' }}>
          {/* left column: profile details */}
          <Card padding="lg" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto var(--space-3)' }}>👤</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, textAlign: 'center' }}>{user?.username}</h2>
              <span className="badge badge-blue" style={{ marginTop: 'var(--space-2)' }}>{user?.role || 'Patient'}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Email:</b> {user?.email}</p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Age:</b> {user?.age || 'Not set'}</p>
              <p style={{ margin: 0, fontSize: '0.9rem', textTransform: 'capitalize' }}><b>Gender:</b> {user?.gender || 'Not set'}</p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Location:</b> {locationParts.length > 0 ? locationParts.join(', ') : 'Not set'}</p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Target Disease:</b> {user?.disease || 'Not set'}</p>
            </div>
          </Card>

          {/* right column: edit form */}
          <Card accentBorder="primary" padding="lg">
            <h2 style={{ textAlign: 'left', fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text)' }}>
              ✏️ Edit Details
            </h2>

            <form onSubmit={handleSubmit}>
              <FormGroup label="Username" htmlFor="username" required>
                <Input type="text" id="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
              </FormGroup>

              <FormGroup label="Email Address" htmlFor="email" required>
                <Input type="email" id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </FormGroup>

              <FormGroup label="Age" htmlFor="age">
                <Input type="number" id="age" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} placeholder="e.g. 25" />
              </FormGroup>

              <FormGroup label="Gender" htmlFor="gender">
                <Select id="gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>

              <FormGroup label="Target Disease / Indication" htmlFor="disease">
                <Input type="text" id="disease" value={formData.disease} onChange={(e) => setFormData({ ...formData, disease: e.target.value })} placeholder="e.g. Asthma" />
              </FormGroup>

              <div className="location-picker">
                <FormGroup label="Country" htmlFor="profile-country">
                  <Select id="profile-country" value={formData.country} onChange={handleCountryChange}>
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                </FormGroup>

                {formData.country && LOCATION_DATA.hasDetailedData(formData.country) && (
                  <FormGroup label="State" htmlFor="profile-state">
                    <Select id="profile-state" value={formData.state} onChange={handleStateChange}>
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Select>
                  </FormGroup>
                )}

                {formData.state && LOCATION_DATA.hasDetailedData(formData.country) && (
                  <FormGroup label="District" htmlFor="profile-district">
                    <Select id="profile-district" value={formData.district} onChange={handleDistrictChange}>
                      <option value="">Select District</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </Select>
                  </FormGroup>
                )}

                {formData.district && LOCATION_DATA.hasDetailedData(formData.country) && (
                  <FormGroup label="City / Place" htmlFor="profile-city">
                    <Select id="profile-city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}>
                      <option value="">Select City</option>
                      {cities.map((ct) => (
                        <option key={ct} value={ct}>{ct}</option>
                      ))}
                    </Select>
                  </FormGroup>
                )}
              </div>

              <Button type="submit" variant="primary" fullWidth loading={loading} style={{ marginTop: 'var(--space-3)' }}>
                Save Changes
              </Button>
            </form>
          </Card>
        </div>

        <h2 style={{ textAlign: 'left', fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text)' }}>
          👥 Joined Communities
        </h2>

        {!user?.communities || user.communities.length === 0 ? (
          <Card padding="lg" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>👥</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 var(--space-2)' }}>No Communities Joined</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}>Explore our community directory and join support groups matching your condition.</p>
            <Link to="/communities" style={{ textDecoration: 'none' }}>
              <Button variant="primary" icon={<i className="fa-solid fa-people-group"></i>}>Explore Communities</Button>
            </Link>
          </Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {user.communities.map((c) => (
              <Card key={c._id || c} padding="md" hover>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px', textAlign: 'left' }}>{c.name || 'Community'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 var(--space-4)' }}>{c.disease}</p>
                <Link to={`/community/${c._id || c}`} style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="sm">Enter Community</Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
