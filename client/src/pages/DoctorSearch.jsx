import React, { useState } from 'react';
import api from '../services/api';

export default function DoctorSearch() {
  const [symptom, setSymptom] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const res = await api.get(`/api/doctor-search?symptom=${encodeURIComponent(symptom)}&city=${encodeURIComponent(city)}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setResults({ doctors: [], hospitals: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(145deg, var(--accent-50) 0%, var(--primary-50) 100%)', padding: '60px 24px 48px', textAlign: 'center', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-dark)', marginBottom: '20px' }}>
            <i className="fa-solid fa-location-dot"></i> Location-Based Search
          </div>
          <h1 className="title" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', marginBottom: '10px' }}>
            Find a <span style={{ background: 'linear-gradient(135deg,var(--accent),var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Trusted Doctor</span> Near You
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 0 }}>
            Instantly locate verified medical specialists in your city based on your symptoms and condition.
          </p>
        </div>
      </div>

      <div className="page-container" style={{ paddingTop: '40px' }}>
        {/* Search Panel */}
        <div style={{ maxWidth: '640px', margin: '0 auto 48px' }}>
          <div className="card" style={{ padding: '32px', borderTop: '3px solid var(--accent)' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="symptom">
                  <i className="fa-solid fa-stethoscope" style={{ color: 'var(--accent)', marginRight: '4px' }}></i>
                  Select Your Symptom
                </label>
                <select id="symptom" value={symptom} onChange={(e) => setSymptom(e.target.value)} required>
                  <option value="" disabled>— Choose a symptom —</option>
                  <option value="cold">🤧 Cold</option>
                  <option value="fever">🌡️ Fever</option>
                  <option value="cough">😮‍💨 Cough</option>
                  <option value="chest pain">💔 Chest Pain</option>
                  <option value="skin rash">🩹 Skin Rash</option>
                  <option value="stomach pain">😣 Stomach Pain</option>
                  <option value="headache">🤕 Headache</option>
                  <option value="eye pain">👁️ Eye Pain</option>
                  <option value="joint pain">🦴 Joint Pain</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="cityInput">
                  <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)', marginRight: '4px' }}></i>
                  Your City / Location
                </label>
                <input
                  type="text"
                  id="cityInput"
                  placeholder="e.g., Hyderabad, Bangalore, Mumbai..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-gradient btn-block" disabled={loading} style={{ marginTop: '4px' }}>
                <i className="fa-solid fa-magnifying-glass"></i> {loading ? 'Searching...' : 'Search Doctors'}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div style={{ maxWidth: '1000px', margin: '0 auto 60px' }}>
            <h2 style={{ textAlign: 'left', fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text)' }}>
              Search Results in {city}
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="spinner"></div>
                <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Searching nearby medical specialists...</p>
              </div>
            ) : results && (results.doctors?.length > 0 || results.hospitals?.length > 0) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {results.doctors?.map((doc, idx) => (
                  <div key={idx} className="card" style={{ padding: '20px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px' }}>Dr. {doc.name || doc.username}</h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>Specialization: {doc.disease || doc.specialization}</p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Location: {doc.city || city}</p>
                    </div>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((doc.name || doc.username) + ' ' + city)}`} target="_blank" rel="noreferrer" className="btn-outline btn-sm">
                      <i className="fa-solid fa-map-location-dot"></i> Maps
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🩺</span>
                <h3>No Doctors Found</h3>
                <p>Try searching for a different symptom or nearby major city.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
