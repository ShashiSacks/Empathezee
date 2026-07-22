import React, { useState } from 'react';
import api from '../services/api';
import { Container, Card, FormGroup, Input, Select, Button, PageHeader } from '../components/ui';

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
    <main style={{ flex: 1 }}>
      <PageHeader
        badge={<><i className="fa-solid fa-location-dot"></i> Location-Based Search</>}
        title="Find a"
        highlight="Trusted Doctor Near You"
        subtitle="Instantly locate verified medical specialists in your city based on your symptoms and condition."
        gradient="accent"
      />

      <Container size="md">
        {/* Search Panel */}
        <Card accentBorder="accent" padding="lg" style={{ marginBottom: 'var(--space-8)' }}>
          <form onSubmit={handleSearch}>
            <FormGroup
              label="Select Your Symptom"
              htmlFor="symptom"
              required
              icon={<i className="fa-solid fa-stethoscope"></i>}
            >
              <Select
                id="symptom"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                required
              >
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
              </Select>
            </FormGroup>

            <FormGroup
              label="Your City / Location"
              htmlFor="cityInput"
              required
              icon={<i className="fa-solid fa-location-dot"></i>}
            >
              <Input
                type="text"
                id="cityInput"
                placeholder="e.g., Hyderabad, Bangalore, Mumbai..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </FormGroup>

            <Button
              type="submit"
              variant="accent"
              fullWidth
              loading={loading}
              icon={<i className="fa-solid fa-magnifying-glass"></i>}
              style={{ marginTop: 'var(--space-2)' }}
            >
              Search Doctors
            </Button>
          </form>
        </Card>

        {/* Results */}
        {searched && (
          <div style={{ marginBottom: 'var(--space-12)' }}>
            <h2 style={{ textAlign: 'left', fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text)' }}>
              Search Results in {city}
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                <div className="spinner"></div>
                <p style={{ marginTop: 'var(--space-4)', color: 'var(--text-secondary)' }}>Searching nearby medical specialists...</p>
              </div>
            ) : results && (results.doctors?.length > 0 || results.hospitals?.length > 0) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {results.doctors?.map((doc, idx) => (
                  <Card key={idx} hover padding="md">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)', textAlign: 'left' }}>Dr. {doc.name || doc.username}</h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Specialist in {doc.specialty || doc.disease || 'General Medicine'}</p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>📍 {doc.location || city}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Book Appointment
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card padding="lg" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🩺</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 var(--space-2)' }}>No Specialists Found</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  We couldn't find matching specialists for "{symptom}" in {city}. Try broadening your search.
                </p>
              </Card>
            )}
          </div>
        )}
      </Container>
    </main>
  );
}
