import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Container, Card, FormGroup, Input, Button, PageHeader } from '../components/ui';

const POPULAR_SYMPTOMS = [
  { label: '🤧 Cold & Flu', val: 'cold' },
  { label: '🌡️ Fever', val: 'fever' },
  { label: '😮‍💨 Cough & Asthma', val: 'cough' },
  { label: '💔 Chest Pain & BP', val: 'chest pain' },
  { label: '🩹 Skin Rash & Acne', val: 'skin rash' },
  { label: '😣 Stomach & Acid Reflux', val: 'stomach pain' },
  { label: '🤕 Headache & Migraine', val: 'headache' },
  { label: '👁️ Eye Pain', val: 'eye pain' },
  { label: '🦴 Joint & Back Pain', val: 'joint pain' },
  { label: '🧘 Stress & Anxiety', val: 'anxiety' },
  { label: '🩸 Diabetes & Thyroid', val: 'diabetes' },
  { label: '💊 Chronic & HIV Support', val: 'hiv' }
];

export default function DoctorSearch() {
  const [symptom, setSymptom] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);

  // Booking Modal State
  const [bookingDoc, setBookingDoc] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [consultType, setConsultType] = useState('virtual');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!symptom.trim() || !city.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await api.get(`/api/doctor-search?symptom=${encodeURIComponent(symptom.trim())}&city=${encodeURIComponent(city.trim())}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setResults({ doctors: [], specialization: 'General Medicine' });
    } finally {
      setLoading(false);
    }
  };

  const selectQuickSymptom = (val) => {
    setSymptom(val);
  };

  const openBookingModal = (doc) => {
    setBookingDoc(doc);
    setBookingDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    setBookingTime('10:00 AM');
    setConsultType('virtual');
    setBookingSuccess(null);
  };

  const closeBookingModal = () => {
    setBookingDoc(null);
    setBookingSuccess(null);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!bookingDoc) return;
    setBookingLoading(true);
    try {
      const res = await api.post('/api/appointments', {
        doctorId: bookingDoc._id || null,
        doctorName: bookingDoc.name,
        date: bookingDate,
        time: bookingTime
      });
      setBookingSuccess(res.data.appointment || {
        doctor: { username: bookingDoc.name, disease: bookingDoc.specialization },
        date: bookingDate,
        time: bookingTime
      });
    } catch (err) {
      console.error('Booking Error:', err);
      alert(err.response?.data?.message || 'Error booking consultation. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <main style={{ flex: 1 }}>
      <PageHeader
        badge={<><i className="fa-solid fa-location-dot"></i> Location & Symptom Based Search</>}
        title="Find a"
        highlight="Trusted Doctor Near You"
        subtitle="Search any symptom or health condition to find verified medical specialists in your city."
      />

      <Container size="md">
        {/* Search Panel */}
        <Card padding="lg" style={{ marginBottom: 'var(--space-8)' }}>
          <form onSubmit={handleSearch}>
            <FormGroup
              label="Type Your Symptom or Health Condition"
              htmlFor="symptomInput"
              required
              icon={<i className="fa-solid fa-stethoscope"></i>}
            >
              <Input
                type="text"
                id="symptomInput"
                placeholder="e.g. Headache, Migraine, Chest Pain, Diabetes, Acne, Fever, Back Pain..."
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                required
              />
            </FormGroup>

            {/* Quick Symptom Chips */}
            <div style={{ marginBottom: 'var(--space-5)', marginTop: '-8px' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textAlign: 'left' }}>
                Or select a common symptom:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {POPULAR_SYMPTOMS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectQuickSymptom(item.val)}
                    style={{
                      background: symptom.toLowerCase() === item.val.toLowerCase() ? 'var(--primary)' : 'var(--primary-50)',
                      color: symptom.toLowerCase() === item.val.toLowerCase() ? 'white' : 'var(--primary)',
                      border: '1px solid rgba(79,70,229,0.2)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <FormGroup
              label="Your City / Location"
              htmlFor="cityInput"
              required
              icon={<i className="fa-solid fa-location-dot"></i>}
            >
              <Input
                type="text"
                id="cityInput"
                placeholder="e.g., Hyderabad, Bangalore, Mumbai, Delhi..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </FormGroup>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              icon={<i className="fa-solid fa-magnifying-glass"></i>}
              style={{ marginTop: 'var(--space-3)' }}
            >
              Search Specialists
            </Button>
          </form>
        </Card>

        {/* Results */}
        {searched && (
          <div style={{ marginBottom: 'var(--space-12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: '8px' }}>
              <h2 style={{ textAlign: 'left', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                Specialists for "{results?.symptom || symptom}" in {city}
              </h2>
              {results?.specialization && (
                <span style={{ background: 'var(--primary-50)', color: 'var(--primary)', fontWeight: 600, padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem' }}>
                  Recommended: {results.specialization}
                </span>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: 'var(--space-4)', color: 'var(--text-secondary)' }}>Locating matching medical specialists in {city}...</p>
              </div>
            ) : results && results.doctors?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {results.doctors.map((doc, idx) => (
                  <Card key={idx} hover padding="md" style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary)', fontWeight: 800, textAlign: 'left' }}>
                            {doc.name}
                          </h3>
                          {doc.source && (
                            <span style={{ fontSize: '0.72rem', background: 'var(--primary-50)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                              {doc.source}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                          Specialist in {doc.specialization}
                        </p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)' }}></i> {doc.address || city}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {doc.mapsLink && (
                          <a href={doc.mapsLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <Button size="sm" variant="outline" icon={<i className="fa-solid fa-map-pin"></i>}>
                              View Map
                            </Button>
                          </a>
                        )}
                        <Button onClick={() => openBookingModal(doc)} size="sm" variant="primary" icon={<i className="fa-solid fa-calendar-check"></i>}>
                          Book Consultation
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card padding="lg" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🩺</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 var(--space-2)' }}>No Direct Specialists Found</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  We couldn't find matching specialists for "{symptom}" in {city}. Try searching for another symptom or location.
                </p>
              </Card>
            )}
          </div>
        )}
      </Container>

      {/* Booking Modal */}
      {bookingDoc && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: '520px', background: 'var(--surface)', borderRadius: '24px', boxShadow: 'var(--shadow-2xl)', padding: '32px', textAlign: 'left', position: 'relative' }}>
            <button onClick={closeBookingModal} style={{ position: 'absolute', top: '24px', right: '24px', width: '32px', height: '32px', border: 'none', background: 'var(--bg-warm)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            {!bookingSuccess ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--primary-50)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    <i className="fa-solid fa-stethoscope"></i>
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text)', textAlign: 'left' }}>Book Consultation</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, margin: 0 }}>{bookingDoc.name}</p>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-warm)', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
                  <div><strong>Specialty:</strong> {bookingDoc.specialization}</div>
                  <div style={{ marginTop: '2px', color: 'var(--text-secondary)' }}><strong>Location:</strong> {bookingDoc.address || city}</div>
                </div>

                <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <FormGroup label="Consultation Type" htmlFor="consultType">
                    <select
                      id="consultType"
                      value={consultType}
                      onChange={(e) => setConsultType(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: 'var(--radius)', border: '1.5px solid var(--border)', width: '100%' }}
                    >
                      <option value="virtual">💻 Telehealth Virtual Consultation</option>
                      <option value="in-person">🏥 In-Person Clinic Visit</option>
                    </select>
                  </FormGroup>

                  <FormGroup label="Select Preferred Date" htmlFor="bookingDate" required>
                    <Input
                      type="date"
                      id="bookingDate"
                      value={bookingDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Select Time Slot" htmlFor="bookingTime" required>
                    <select
                      id="bookingTime"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: 'var(--radius)', border: '1.5px solid var(--border)', width: '100%' }}
                      required
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                  </FormGroup>

                  <Button type="submit" variant="primary" fullWidth loading={bookingLoading} style={{ marginTop: '8px' }}>
                    Confirm Consultation
                  </Button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ width: '64px', height: '64px', background: 'var(--primary-50)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem' }}>
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h3 style={{ color: 'var(--primary)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>Consultation Confirmed!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Your appointment has been successfully scheduled.
                </p>

                <div style={{ background: 'var(--bg-warm)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', textAlign: 'left', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  <div><strong>Doctor:</strong> {bookingDoc.name}</div>
                  <div><strong>Specialty:</strong> {bookingDoc.specialization}</div>
                  <div><strong>Date & Time:</strong> {bookingDate} at {bookingTime}</div>
                  <div><strong>Status:</strong> <span className="badge badge-green" style={{ marginLeft: '6px' }}>Confirmed</span></div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to="/appointments-ui" style={{ flex: 1, textDecoration: 'none' }}>
                    <Button variant="primary" fullWidth size="sm">
                      View My Appointments
                    </Button>
                  </Link>
                  <Button onClick={closeBookingModal} variant="outline" size="sm" style={{ flex: 1 }}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
