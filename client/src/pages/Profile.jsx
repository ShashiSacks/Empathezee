import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LOCATION_DATA from '../utils/locationData';
import { Container, Card, FormGroup, Input, Select, Button, PageHeader } from '../components/ui';

export default function Profile() {
  const { user, fetchUser } = useAuth();
  const isDoctor = user?.role === 'doctor';

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    gender: 'male',
    disease: '',
    bio: '',
    country: '',
    state: '',
    district: '',
    city: '',
    emailNotifications: true,
    // Doctor specific
    specialization: '',
    qualifications: '',
    experienceYears: '',
    clinicName: '',
    clinicAddress: '',
    consultationFee: '',
    availableDays: '',
    availableHours: '',
    licenseNumber: '',
    phone: '',
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
        bio: user.bio || '',
        country: user.country || '',
        state: user.state || '',
        district: user.district || '',
        city: user.city || '',
        emailNotifications: user.emailNotifications !== false,
        // Doctor specific
        specialization: user.specialization || user.disease || '',
        qualifications: user.qualifications || '',
        experienceYears: user.experienceYears || '',
        clinicName: user.clinicName || '',
        clinicAddress: user.clinicAddress || '',
        consultationFee: user.consultationFee || '',
        availableDays: user.availableDays || 'Mon - Sat',
        availableHours: user.availableHours || '09:00 AM - 05:00 PM',
        licenseNumber: user.licenseNumber || '',
        phone: user.phone || '',
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
  const docDisplayName = user?.username?.startsWith('Dr.') ? user.username : `Dr. ${user?.username || 'Specialist'}`;

  return (
    <main style={{ flex: 1 }}>
      <PageHeader
        badge={<><i className={isDoctor ? "fa-solid fa-stethoscope" : "fa-solid fa-user-gear"}></i> {isDoctor ? "Doctor Practice Settings" : "Account Settings"}</>}
        title={isDoctor ? "Doctor Professional" : "User"}
        highlight="Profile"
        subtitle={isDoctor ? "Manage your clinical details, credentials, consultation rates, operating hours, and location." : "Manage your personal details, location preferences, disease indication, and joined support communities."}
        gradient={isDoctor ? "accent" : "primary"}
      />

      <Container size="xl">
        {statusMsg && (
          <div style={{ padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius)', background: 'var(--secondary-50)', color: 'var(--secondary-dark)', marginBottom: 'var(--space-6)', textAlign: 'center', fontWeight: 600 }}>
            {statusMsg}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-8)', marginBottom: 'var(--space-10)' }}>
          {/* Left Column: Profile Card */}
          <Card padding="lg" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: isDoctor ? 'var(--primary)' : 'var(--primary-50)', color: isDoctor ? 'white' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto var(--space-3)', fontWeight: 800 }}>
                {isDoctor ? '🩺' : '👤'}
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, textAlign: 'center', color: 'var(--text)' }}>
                {isDoctor ? docDisplayName : user?.username}
              </h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: 'var(--space-2)' }}>
                <span className={`badge ${isDoctor ? 'badge-green' : 'badge-blue'}`}>
                  {isDoctor ? 'Verified Healthcare Specialist' : (user?.role || 'Patient')}
                </span>
              </div>
            </div>

            {isDoctor ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)', textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Specialization:</b> {user?.specialization || user?.disease || 'Not set'}</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Qualifications:</b> {user?.qualifications || 'Not set'}</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Experience:</b> {user?.experienceYears ? `${user.experienceYears} Years` : 'Not set'}</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}><b>License / Reg No:</b> {user?.licenseNumber || 'Not set'}</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Clinic / Hospital:</b> {user?.clinicName || 'Not set'}</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Clinic Address:</b> {user?.clinicAddress || 'Not set'}</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Consultation Fee:</b> ₹{user?.consultationFee || 500}</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Working Hours:</b> {user?.availableHours || '09:00 AM - 05:00 PM'} ({user?.availableDays || 'Mon - Sat'})</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Location:</b> {locationParts.length > 0 ? locationParts.join(', ') : 'Not set'}</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Contact Phone:</b> {user?.phone || 'Not set'}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)', textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Email:</b> {user?.email}</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Age:</b> {user?.age || 'Not set'}</p>
                <p style={{ margin: 0, fontSize: '0.9rem', textTransform: 'capitalize' }}><b>Gender:</b> {user?.gender || 'Not set'}</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Location:</b> {locationParts.length > 0 ? locationParts.join(', ') : 'Not set'}</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Target Disease:</b> {user?.disease || 'Not set'}</p>
                <p style={{ margin: 0, fontSize: '0.9rem' }}><b>Email Notifications:</b> {user?.emailNotifications !== false ? '🔔 Enabled' : '🔕 Disabled'}</p>
              </div>
            )}
          </Card>

          {/* Right Column: Edit Profile Form */}
          <Card accentBorder="primary" padding="lg">
            <h2 style={{ textAlign: 'left', fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text)' }}>
              ✏️ {isDoctor ? 'Edit Practice & Credentials' : 'Edit Personal Details'}
            </h2>

            <form onSubmit={handleSubmit}>
              <FormGroup label={isDoctor ? "Doctor Full Name" : "Username"} htmlFor="username" required>
                <Input type="text" id="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
              </FormGroup>

              <FormGroup label="Email Address" htmlFor="email" required>
                <Input type="email" id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </FormGroup>

              {isDoctor ? (
                <>
                  <FormGroup label="Medical Specialization" htmlFor="specialization" required>
                    <Input type="text" id="specialization" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value, disease: e.target.value })} placeholder="e.g. Cardiology, Endocrinology, Pulmonology" required />
                  </FormGroup>

                  <FormGroup label="Qualifications / Degrees" htmlFor="qualifications">
                    <Input type="text" id="qualifications" value={formData.qualifications} onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })} placeholder="e.g. MBBS, MD, DM (Cardiology)" />
                  </FormGroup>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <FormGroup label="Years of Experience" htmlFor="experienceYears">
                      <Input type="number" id="experienceYears" value={formData.experienceYears} onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })} placeholder="e.g. 10" />
                    </FormGroup>

                    <FormGroup label="License / Reg. Number" htmlFor="licenseNumber">
                      <Input type="text" id="licenseNumber" value={formData.licenseNumber} onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} placeholder="e.g. MCI-884920" />
                    </FormGroup>
                  </div>

                  <FormGroup label="Clinic / Hospital Name" htmlFor="clinicName">
                    <Input type="text" id="clinicName" value={formData.clinicName} onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })} placeholder="e.g. Apollo Heart Center" />
                  </FormGroup>

                  <FormGroup label="Clinic Street Address" htmlFor="clinicAddress">
                    <Input type="text" id="clinicAddress" value={formData.clinicAddress} onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })} placeholder="e.g. Suite 402, Medical Center Plaza" />
                  </FormGroup>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <FormGroup label="Consultation Fee (₹)" htmlFor="consultationFee">
                      <Input type="number" id="consultationFee" value={formData.consultationFee} onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })} placeholder="e.g. 500" />
                    </FormGroup>

                    <FormGroup label="Contact Phone" htmlFor="phone">
                      <Input type="text" id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 9876543210" />
                    </FormGroup>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <FormGroup label="Available Days" htmlFor="availableDays">
                      <Input type="text" id="availableDays" value={formData.availableDays} onChange={(e) => setFormData({ ...formData, availableDays: e.target.value })} placeholder="e.g. Mon - Sat" />
                    </FormGroup>

                    <FormGroup label="Operating Hours" htmlFor="availableHours">
                      <Input type="text" id="availableHours" value={formData.availableHours} onChange={(e) => setFormData({ ...formData, availableHours: e.target.value })} placeholder="e.g. 09:00 AM - 05:00 PM" />
                    </FormGroup>
                  </div>

                  <FormGroup label="Professional Bio / Clinical Summary" htmlFor="doc-bio">
                    <textarea
                      id="doc-bio"
                      className="form-input"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius)', border: '1.5px solid var(--border)', minHeight: '80px', fontFamily: 'inherit' }}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Brief clinical background, achievements, and focus areas..."
                    />
                  </FormGroup>
                </>
              ) : (
                <>
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
                </>
              )}

              {/* Location Picker */}
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

              <div style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', background: 'var(--slate-50)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius)' }}>
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
                <label htmlFor="emailNotifications" style={{ cursor: 'pointer', fontSize: '0.92rem', fontWeight: 600, color: 'var(--text)' }}>
                  Receive Email Notifications & Consultation Updates
                </label>
              </div>

              <Button type="submit" variant="primary" fullWidth loading={loading} style={{ marginTop: 'var(--space-3)' }}>
                Save Profile Changes
              </Button>
            </form>
          </Card>
        </div>

        {!isDoctor && (
          <>
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
          </>
        )}
      </Container>
    </main>
  );
}
