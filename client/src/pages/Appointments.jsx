import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, Stethoscope, Video, XCircle, Search, Mail, User } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [specFilter, setSpecFilter] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appRes, docRes] = await Promise.all([
        axios.get('/api/appointments'),
        axios.get('/api/users/doctors')
      ]);
      setAppointments(appRes.data);
      setDoctors(docRes.data);
    } catch (err) {
      console.error('Error fetching appointments data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await axios.delete(`/api/appointments/${id}`);
      setAppointments(prev => prev.filter(app => app._id !== id));
      alert('Appointment cancelled successfully.');
    } catch (err) {
      alert('Failed to cancel appointment.');
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || !date || !time) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const payload = new URLSearchParams();
      payload.append('doctorId', selectedDoctorId);
      payload.append('date', date);
      payload.append('time', time);

      await axios.post('/api/appointments', payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      // Update local list
      fetchData();
      
      // Reset form
      setSelectedDoctorId('');
      setDate('');
      setTime('');
      alert('Appointment booked successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to book appointment.');
    }
  };

  // Derive unique specializations from doctors list
  const specializations = useMemo(() => {
    const specs = new Set();
    doctors.forEach(doc => {
      if (doc.disease) specs.add(doc.disease.trim());
    });
    return Array.from(specs);
  }, [doctors]);

  // Filtered doctors for dropdown
  const filteredDoctors = useMemo(() => {
    if (!specFilter) return doctors;
    return doctors.filter(doc => doc.disease && doc.disease.toLowerCase().includes(specFilter.toLowerCase()));
  }, [doctors, specFilter]);

  if (loading) {
    return (
      <main className="page-container" style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px', borderTopColor: 'var(--primary)' }}></div>
      </main>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <main className="page-container" style={{ paddingTop: '40px', paddingBottom: '64px' }}>
      <h1 className="title" style={{ textAlign: 'center', marginBottom: '40px' }}>Your Appointments</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Left Column: Existing Appointments */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--primary-50)', color: 'var(--primary)', padding: '10px', borderRadius: '10px' }}>
              <Calendar size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Booked Appointments</h2>
          </div>

          {appointments.length === 0 ? (
            <div className="card" style={{ padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <Calendar size={48} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>No Appointments</h3>
              <p style={{ color: 'var(--text-secondary)' }}>You have not booked any doctor appointments yet. Use the form on the right to schedule one.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {appointments.map(app => (
                <div key={app._id} className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        <User size={24} />
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem' }}>Dr. {app.doctor?.username}</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Stethoscope size={14} /> {app.doctor?.disease || 'General Medicine'}
                        </p>
                      </div>
                    </div>
                    <span className={`badge badge-${app.status === 'CONFIRMED' ? 'green' : app.status === 'CANCELLED' ? 'red' : 'orange'}`}>
                      {app.status}
                    </span>
                  </div>

                  <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '12px', display: 'flex', flexWrap: 'wrap', gap: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <Calendar size={16} /> <span style={{ color: 'var(--text)', fontWeight: 500 }}>{app.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <Clock size={16} /> <span style={{ color: 'var(--text)', fontWeight: 500 }}>{app.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', width: '100%' }}>
                      <Mail size={16} /> <span style={{ color: 'var(--text)' }}>{app.doctor?.email}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                    {app.status === 'CONFIRMED' && (
                      <Link to={`/chat/appointment/${app._id}`} className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}>
                        <Video size={18} /> Join Telehealth
                      </Link>
                    )}
                    <button onClick={() => handleCancel(app._id)} className="btn-outline" style={{ flex: app.status === 'CONFIRMED' ? 0 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--danger)', borderColor: 'var(--border)', padding: '12px' }}>
                      <XCircle size={18} /> {app.status === 'CONFIRMED' ? '' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Book Appointment */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--primary-50)', color: 'var(--primary)', padding: '10px', borderRadius: '10px' }}>
              <Stethoscope size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Book New Appointment</h2>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <form onSubmit={handleBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="form-group">
                <label>Filter by Specialization</label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select value={specFilter} onChange={(e) => {
                      setSpecFilter(e.target.value);
                      setSelectedDoctorId(''); // Reset doctor selection
                  }} style={{ paddingLeft: '40px' }}>
                    <option value="">-- All Specializations --</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec.toLowerCase()}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Select Specialist (Doctor)</label>
                <select required value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)}>
                  <option value="" disabled>-- Choose a Doctor --</option>
                  {filteredDoctors.map(doc => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.username} ({doc.disease || 'General'}) - {doc.city || 'Kadapa'}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Choose Date</label>
                  <input type="date" required min={today} value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Select Time</label>
                  <select required value={time} onChange={(e) => setTime(e.target.value)}>
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
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '8px', padding: '14px', fontSize: '1rem', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <Calendar size={18} /> Book Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Appointments;
