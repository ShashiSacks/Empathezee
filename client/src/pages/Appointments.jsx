import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Container, Card, FormGroup, Select, Input, Button, PageHeader } from '../components/ui';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/appointments');
      setAppointments(res.data.appointments || []);
      setDoctors(res.data.doctors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/appointments', {
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
      });
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.post(`/api/appointments/${id}/delete`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    if (!specFilter) return true;
    return doc.disease?.toLowerCase().includes(specFilter.toLowerCase());
  });

  const specializations = Array.from(
    new Set(doctors.map((d) => d.disease?.trim()).filter(Boolean))
  );

  return (
    <main style={{ flex: 1 }}>
      <PageHeader
        badge={<><i className="fa-solid fa-calendar-check"></i> Consultations & Telehealth</>}
        title="Your"
        highlight="Appointments"
        subtitle="Manage upcoming consultations, join virtual telehealth sessions, or schedule a visit with verified medical specialists."
        gradient="primary"
      />

      <Container size="xl">
        <div className="appointment-layout">
          {/* left column: existing appointments */}
          <div className="appointment-list-section">
            <h2 style={{ textAlign: 'left', fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text)' }}>
              📅 Booked Appointments
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                <div className="spinner"></div>
              </div>
            ) : appointments.length === 0 ? (
              <Card padding="lg" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>📅</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 var(--space-2)' }}>No Appointments Yet</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  You have not booked any doctor appointments yet. Use the scheduling form to book your first consultation.
                </p>
              </Card>
            ) : (
              <div className="appointment-grid">
                {appointments.map((app) => (
                  <Card key={app._id} padding="md" hover>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                      <span className={`badge status-${app.status?.toLowerCase()}`}>{app.status}</span>
                    </div>
                    <h3 style={{ textAlign: 'left', margin: '0 0 var(--space-2)', fontSize: '1.1rem', color: 'var(--primary)' }}>Dr. {app.doctor?.username}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0' }}><b>Specialization:</b> {app.doctor?.disease || 'General Medicine'}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0' }}><b>Date:</b> {app.date}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0' }}><b>Time:</b> {app.time}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 var(--space-4)' }}><b>Contact:</b> {app.doctor?.email}</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {app.status === 'CONFIRMED' && (
                        <Link to={`/chat/appointment/${app._id}`} style={{ textDecoration: 'none' }}>
                          <Button variant="primary" fullWidth size="sm" icon={<i className="fa-solid fa-comments"></i>}>
                            Join Telehealth Chat
                          </Button>
                        </Link>
                      )}
                      <Button onClick={() => handleCancel(app._id)} variant="danger" fullWidth size="sm">
                        Cancel Appointment
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* right column: book an appointment */}
          <div className="appointment-form-section">
            <h2 style={{ textAlign: 'left', fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text)' }}>
              🩺 Book New Appointment
            </h2>
            <Card accentBorder="primary" padding="lg">
              <form onSubmit={handleBook}>
                <FormGroup label="Filter by Specialization" htmlFor="specializationFilter">
                  <Select id="specializationFilter" value={specFilter} onChange={(e) => setSpecFilter(e.target.value)}>
                    <option value="">-- All Specializations --</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup label="Select Specialist (Doctor)" htmlFor="doctorId" required>
                  <Select id="doctorId" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
                    <option value="" disabled>-- Choose a Doctor --</option>
                    {filteredDoctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>Dr. {doc.username} ({doc.disease || 'General'}) - {doc.city || 'Location'}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup label="Choose Date" htmlFor="date" required>
                  <Input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </FormGroup>

                <FormGroup label="Select Time" htmlFor="time" required>
                  <Select id="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} required>
                    <option value="" disabled>-- Select Time Slot --</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </Select>
                </FormGroup>

                <Button type="submit" variant="primary" fullWidth style={{ marginTop: 'var(--space-2)' }}>
                  Confirm Appointment
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
}
