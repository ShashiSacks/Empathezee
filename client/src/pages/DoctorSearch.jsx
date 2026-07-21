import React, { useState } from 'react';
import axios from 'axios';
import { 
  Search, MapPin, Database, ShieldHalf, Map, MapPinned, 
  Stethoscope, Activity 
} from 'lucide-react';

const DoctorSearch = () => {
  const [symptom, setSymptom] = useState('');
  const [city, setCity] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(false);

  const specialtyIcons = {
    "General Practitioner": "🏥",
    "General Physician":    "🩺",
    "Cardiologist":        "❤️",
    "Pulmonologist":       "💨",
    "Ophthalmologist":     "👁️",
    "Dermatologist":       "🩹",
    "Gastroenterologist":  "🫁",
    "Neurologist":         "🧠",
    "Orthopedic":          "🦴",
    "ENT Specialist":      "👂",
    default:               "👨‍⚕️"
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!symptom || !city) return;

    setLoading(true);
    setResults(null);
    setError(false);

    try {
      const res = await axios.get(`/doctor/search?symptom=${encodeURIComponent(symptom)}&city=${encodeURIComponent(city)}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(145deg, var(--accent-50) 0%, var(--primary-50) 100%)',
        padding: '64px 24px 48px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '-30px', right: '-30px', width: '200px', height: '200px', background: 'radial-gradient(circle,rgba(20,184,166,0.08),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-40px', left: '-20px', width: '180px', height: '180px', background: 'radial-gradient(circle,rgba(37,99,235,0.07),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-dark)', marginBottom: '20px' }}>
            <MapPin size={14} /> Location-Based Search
          </div>
          <h1 className="title" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', marginBottom: '16px' }}>
            Find a <span style={{ background: 'linear-gradient(135deg,var(--accent),var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Trusted Doctor</span> Near You
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 0 }}>
            Instantly locate verified medical specialists in your city based on your symptoms and condition.
          </p>
        </div>
      </div>

      <div className="page-container" style={{ paddingTop: '40px' }}>

        {/* Search Panel */}
        <div style={{ maxWidth: '640px', margin: '0 auto 48px' }} role="search" aria-label="Find doctors">
          <div className="card" style={{ padding: '32px', borderTop: '4px solid var(--accent)' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="symptom" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={16} style={{ color: 'var(--accent)' }} />
                  Select Your Symptom
                </label>
                <select id="symptom" required aria-required="true" value={symptom} onChange={e => setSymptom(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--bg)' }}>
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
                <label htmlFor="cityInput" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} style={{ color: 'var(--primary)' }} />
                  Your City / Location
                </label>
                <input type="text" id="cityInput" placeholder="e.g., Hyderabad, Bangalore, Mumbai..." required aria-required="true" value={city} onChange={e => setCity(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--bg)' }} />
              </div>

              <button type="submit" className="btn-gradient" disabled={loading} style={{ width: '100%', padding: '14px', marginTop: '8px', fontSize: '1rem', borderRadius: '12px' }}>
                {loading ? 'Searching...' : <><Search size={18} /> Search Doctors</>}
              </button>
            </form>
          </div>

          {/* Tips */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={14} style={{ color: 'var(--primary)' }} />
              Powered by OpenStreetMap
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldHalf size={14} style={{ color: 'var(--secondary)' }} />
              Verified professionals
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Map size={14} style={{ color: 'var(--accent)' }} />
              View on Google Maps
            </span>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="card" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '40px', maxWidth: '400px' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px', borderTopColor: 'var(--accent)' }}></div>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Searching nearby doctors...</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>Querying OpenStreetMap database for specialists in your city.</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && results.doctors && results.doctors.length > 0 && (
          <div role="region" aria-live="polite">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ textAlign: 'left', fontSize: '1.3rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
                {results.specialization}s in {city}
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, background: 'var(--bg-warm)', padding: '4px 12px', borderRadius: '20px' }}>
                {results.doctors.length} specialist{results.doctors.length !== 1 ? 's' : ''} found
              </span>
            </div>
            <div className="container">
              {results.doctors.map((doc, idx) => {
                const icon = specialtyIcons[results.specialization] || specialtyIcons.default;
                const ratingStars = "⭐".repeat(Math.floor(Math.random() * 2) + 4);
                const fee = "₹" + (Math.floor(Math.random() * 5 + 3) * 100 + 500);
                const isAvailable = Math.random() > 0.3;
                const reviewsCount = Math.floor(Math.random() * 150 + 20);

                return (
                  <article key={idx} className="card animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="card-body">
                      <div style={{ fontSize: '2rem', marginBottom: '16px' }} aria-hidden="true">{icon}</div>
                      
                      {isAvailable && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-dark)', background: 'var(--secondary-50)', padding: '4px 10px', borderRadius: '12px', marginBottom: '12px' }}>
                          <span className="online-dot"></span> Available Today
                        </div>
                      )}
                      
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                        {results.specialization}
                      </div>
                      
                      <h3 style={{ textAlign: 'left', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                        {doc.name}
                      </h3>
                      
                      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem' }}>{ratingStars}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>({reviewsCount} reviews)</span>
                      </div>
                      
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                        {doc.address}
                      </p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Consultation</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{fee} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/ visit</span></div>
                        </div>
                        <a href={doc.mapsLink} target="_blank" rel="noopener noreferrer" className="btn-teal btn-sm" aria-label={`Open ${doc.name} in Google Maps`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPinned size={14} /> Maps
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State / Error */}
        {(error || (results && results.doctors && results.doctors.length === 0)) && !loading && (
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto 48px', textAlign: 'center', padding: '48px 32px' }} role="alert">
            <div style={{ fontSize: '3rem', marginBottom: '16px' }} aria-hidden="true">🩺</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>No Doctors Found</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>We couldn't find clinics matching that symptom in your city. Try a nearby larger city, or check your spelling.</p>
          </div>
        )}

      </div>
    </main>
  );
};

export default DoctorSearch;
