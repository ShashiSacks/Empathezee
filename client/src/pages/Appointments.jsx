import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

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
    <main className="page-container">
      <h1 className="title">Your Appointments</h1>

      <div className="appointment-layout">
        {/* left column: existing appointments */}
        <div className="appointment-list-section">
          <h2>📅 Booked Appointments</h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📅</span>
              <h3>No Appointments</h3>
              <p>You have not booked any doctor appointments yet. Use the form on the right to schedule one.</p>
            </div>
          ) : (
            <div className="appointment-grid">
              {appointments.map((app) => (
                <div key={app._id} className="card appointment-card">
                  <div className="card-header">
                    <span className={`badge status-${app.status?.toLowerCase()}`}>{app.status}</span>
                  </div>
                  <h3>Dr. {app.doctor?.username}</h3>
                  <p className="app-detail"><b>Specialization:</b> {app.doctor?.disease || 'General Medicine'}</p>
                  <p className="app-detail"><b>Date:</b> {app.date}</p>
                  <p className="app-detail"><b>Time:</b> {app.time}</p>
                  <p className="app-detail"><b>Contact:</b> {app.doctor?.email}</p>

                  <div className="appointment-card-actions" style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {app.status === 'CONFIRMED' && (
                      <Link to={`/chat/appointment/${app._id}`} className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', width: '100%', padding: '10px 16px', fontSize: '0.95rem', fontWeight: 700 }}>💬 Join Telehealth Chat</Link>
                    )}
                    <button onClick={() => handleCancel(app._id)} className="btn-danger-outline" style={{ width: '100%', padding: '8px 16px', fontSize: '0.9rem' }}>
                      Cancel Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* right column: book an appointment */}
        <div className="appointment-form-section">
          <h2>🩺 Book New Appointment</h2>
          <form onSubmit={handleBook} className="form-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label htmlFor="specializationFilter">Filter by Specialization</label>
              <select id="specializationFilter" value={specFilter} onChange={(e) => setSpecFilter(e.target.value)}>
                <option value="">-- All Specializations --</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="doctorId">Select Specialist (Doctor)</label>
              <select id="doctorId" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
                <option value="" disabled>-- Choose a Doctor --</option>
                {filteredDoctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>Dr. {doc.username} ({doc.disease || 'General'}) - {doc.city || 'Location'}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Choose Date</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Select Time</label>
              <select id="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} required>
                <option value="" disabled>-- Select Time Slot --</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>
            </div>

            <button type="submit" className="btn-primary btn-block">Confirm Appointment</button>
          </form>
        </div>
      </div>
    </main>
  );
}
