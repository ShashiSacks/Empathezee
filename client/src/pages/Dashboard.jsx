import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Stethoscope, Pill, Sparkles, ArrowRight, Search, 
  CalendarPlus, ShieldHalf, Phone, Ambulance, Brain
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [wellnessTip, setWellnessTip] = useState('');
  const [communityCount, setCommunityCount] = useState(0);

  const tips = [
    "Drink at least 8 glasses of water today.",
    "Take a 5-minute break to stretch your legs.",
    "Focus on deep breathing for 60 seconds.",
    "A quick walk can boost your energy levels.",
    "Remember to take your prescribed medicines on time."
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('🌅 Good morning');
    else if (hour < 17) setGreeting('☀️ Good afternoon');
    else if (hour < 21) setGreeting('🌆 Good evening');
    else setGreeting('🌙 Good night');
    
    setWellnessTip(tips[Math.floor(Math.random() * tips.length)]);

    // Fetch functional data silently
    const fetchData = async () => {
      try {
        const [appRes, comRes] = await Promise.all([
          axios.get('/api/appointments').catch(() => ({ data: [] })),
          axios.get('/api/communities').catch(() => ({ data: [] }))
        ]);
        
        if (appRes.data && appRes.data.length > 0) {
          // Sort to find the nearest upcoming appointment
          const upcoming = appRes.data
            .filter(a => new Date(a.date) >= new Date() && a.status === 'confirmed')
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
          setUpcomingAppointment(upcoming);
        }
        
        if (comRes.data) {
          setCommunityCount(comRes.data.length);
        }
      } catch (error) {
        console.error("Failed to load dashboard widgets", error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="page-container">
      {/* Personalized Greeting Banner */}
      <div className="dashboard-greeting animate-fade-up card" id="greeting-banner" style={{ border: 'none', background: 'var(--grad-hero)', padding: '48px 32px', marginBottom: '32px' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p className="greeting-time" id="greeting-time-label" style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>{greeting}</p>
          <h1 className="greeting-title" style={{ fontSize: '2.5rem', marginTop: '0', marginBottom: '16px' }}>
            Welcome back, <span className="highlight" style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.username}</span> 👋
          </h1>
          <p className="greeting-subtitle" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            You are signed in as a <strong>{user?.role}</strong>.
            {user?.disease && (
              <> Your community focus: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user.disease}</span></>
            )}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
            <Link to="/communities" className="btn-primary" id="dash-cta-communities">
              <Users size={18} /> Find Your Community
            </Link>
            <Link to="/doctor/search" className="btn-outline" id="dash-cta-doctors">
              <Stethoscope size={18} /> Book a Doctor
            </Link>
          </div>
        </div>
      </div>

      {/* Functional Dynamic Widgets Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        {/* Appointment Widget */}
        <div className="card animate-fade-up" style={{ padding: '24px', borderTop: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '10px', background: 'var(--primary-50)', borderRadius: '12px', color: 'var(--primary)' }}>
              <CalendarPlus size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>Next Appointment</h3>
          </div>
          {upcomingAppointment ? (
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text)', margin: '0 0 4px 0' }}>
                Dr. {upcomingAppointment.doctor?.username || 'Specialist'}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                {new Date(upcomingAppointment.date).toLocaleDateString()} at {upcomingAppointment.time}
              </p>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              No upcoming appointments. <Link to="/doctor/search" style={{ color: 'var(--primary)', fontWeight: 600 }}>Book now</Link>.
            </p>
          )}
        </div>

        {/* Wellness Tip Widget */}
        <div className="card animate-fade-up" style={{ padding: '24px', borderTop: '4px solid var(--secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '10px', background: 'var(--secondary-50)', borderRadius: '12px', color: 'var(--secondary)' }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>Daily Wellness Tip</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
            "{wellnessTip}"
          </p>
        </div>

        {/* Community Activity Widget */}
        <div className="card animate-fade-up" style={{ padding: '24px', borderTop: '4px solid var(--accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '10px', background: 'var(--accent-50)', borderRadius: '12px', color: 'var(--accent-dark)' }}>
              <Users size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>Active Communities</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            <strong style={{ color: 'var(--text)' }}>{communityCount > 0 ? communityCount : 'Several'}</strong> support groups are active right now. <Link to="/communities" style={{ color: 'var(--accent-dark)', fontWeight: 600 }}>Join the conversation</Link>.
          </p>
        </div>

      </div>

      <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '24px' }}>Quick Access</h2>
      
      {/* Main Dashboard Cards */}
      <div className="container" style={{ marginBottom: '40px' }}>
        
        {/* Communities */}
        <div className="card animate-fade-up">
          <div className="card-body">
            <div style={{ padding: '12px', background: 'var(--primary-50)', borderRadius: '12px', display: 'inline-flex', marginBottom: '16px', color: 'var(--primary)' }}>
              <Users size={28} />
            </div>
            <h2 style={{ textAlign: 'left', fontSize: '1.25rem', color: 'var(--text)', marginBottom: '8px' }}>Communities</h2>
            <p>Join disease-based support communities, share discussions, and connect with others who truly understand your journey.</p>
            <Link to="/communities" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
              <ArrowRight size={18} /> Open Directory
            </Link>
          </div>
        </div>

        {/* Find Doctors */}
        <div className="card animate-fade-up">
          <div className="card-body">
            <div style={{ padding: '12px', background: 'var(--accent-50)', borderRadius: '12px', display: 'inline-flex', marginBottom: '16px', color: 'var(--accent-dark)' }}>
              <Search size={28} />
            </div>
            <h2 style={{ textAlign: 'left', fontSize: '1.25rem', color: 'var(--text)', marginBottom: '8px' }}>Find Doctors</h2>
            <p>Locate verified medical specialists nearby using symptom-based location search. Book consultations in seconds.</p>
            <Link to="/doctor/search" className="btn-teal" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
              <Search size={18} /> Search Directory
            </Link>
          </div>
        </div>

        {/* Medicines */}
        <div className="card animate-fade-up">
          <div className="card-body">
            <div style={{ padding: '12px', background: 'var(--warning-bg)', borderRadius: '12px', display: 'inline-flex', marginBottom: '16px', color: 'var(--warning)' }}>
              <Pill size={28} />
            </div>
            <h2 style={{ textAlign: 'left', fontSize: '1.25rem', color: 'var(--text)', marginBottom: '8px' }}>Medicine Directory</h2>
            <p>Browse verified medicine catalogs, search drug information, and order prescribed medicines with fast delivery.</p>
            <Link to="/medicine" className="btn-warning" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
              <Pill size={18} /> Open Catalog
            </Link>
          </div>
        </div>

        {/* Doctor Panel (only for doctor role) */}
        {user?.role === "doctor" && (
          <div className="card animate-fade-up" style={{ border: '1.5px solid var(--primary)' }}>
            <div className="card-body">
              <div style={{ padding: '12px', background: 'var(--primary-50)', borderRadius: '12px', display: 'inline-flex', marginBottom: '16px', color: 'var(--primary)' }}>
                <ShieldHalf size={28} />
              </div>
              <h2 style={{ textAlign: 'left', fontSize: '1.25rem', color: 'var(--text)', marginBottom: '8px' }}>Doctor Moderation</h2>
              <p>Review reported community posts, verify medical information, view patient consultations, and manage your dashboard.</p>
              <Link to="/doctor/dashboard" className="btn-gradient" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
                <ShieldHalf size={18} /> Open Moderator Panel
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Support Section */}
      <div className="card animate-fade-up" style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'center' }}>
        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Phone size={32} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ textAlign: 'left', color: 'var(--danger)', fontSize: '1.1rem', marginBottom: '8px' }}>Need Immediate Help?</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px', lineHeight: 1.5 }}>
            If you are experiencing a medical emergency, please contact emergency services immediately.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="tel:112" className="btn-danger">
              <Phone size={18} /> Call 112
            </a>
            <a href="tel:102" className="btn-danger-outline">
              <Ambulance size={18} /> Ambulance 102
            </a>
            <a href="tel:1800111565" className="btn-danger-outline">
              <Brain size={18} /> Mental Health Helpline
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
