import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <main className="page-container">
      {/* Personalized Greeting Banner */}
      <div className="dashboard-greeting animate-fade-up" id="greeting-banner" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p className="greeting-time" id="greeting-time-label">{getGreeting()}</p>
          <h1 className="greeting-title">
            Welcome back, <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{user?.username || 'User'}</span> 👋
          </h1>
          <p className="greeting-subtitle">
            You are signed in as a <strong>{user?.role || 'user'}</strong>.
            {user?.disease && (
              <> Your community: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user.disease}</span></>
            )}
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
            <Link to="/communities" className="btn-primary btn-sm" id="dash-cta-communities">
              <i className="fa-solid fa-people-group"></i> Find Your Community
            </Link>
            <Link to="/doctor/search" className="btn-outline btn-sm" id="dash-cta-doctors" style={{ borderRadius: '999px' }}>
              <i className="fa-solid fa-user-doctor"></i> Book a Doctor
            </Link>
          </div>
        </div>

        {/* Decorative blob */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          right: '32px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '120px',
          height: '120px',
          background: 'var(--grad-primary)',
          borderRadius: '50%',
          opacity: 0.08,
          pointerEvents: 'none'
        }}></div>
      </div>

      {/* Quick Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }} aria-label="Health stats overview">
        <div className="card animate-fade-up" style={{ padding: '20px', textAlign: 'center', animationDelay: '0.05s' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>👥</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>Join a Group</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Connect with peers</div>
        </div>
        <div className="card animate-fade-up" style={{ padding: '20px', textAlign: 'center', animationDelay: '0.10s' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🩺</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-dark)', letterSpacing: '-0.02em' }}>Book a Doc</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Expert guidance</div>
        </div>
        <div className="card animate-fade-up" style={{ padding: '20px', textAlign: 'center', animationDelay: '0.15s' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>💊</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--secondary-dark)', letterSpacing: '-0.02em' }}>Order Meds</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Fast delivery</div>
        </div>
        <div className="card animate-fade-up" style={{ padding: '20px', textAlign: 'center', animationDelay: '0.20s' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🧘</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--warning)', letterSpacing: '-0.02em' }}>Wellness</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Mind & body</div>
        </div>
      </div>

      {/* Main Dashboard Cards */}
      <div className="dashboard-grid" id="dashboard-main-grid">
        {/* Communities */}
        <div className="dashboard-card animate-fade-up" style={{ animationDelay: '0.05s' }} id="dash-card-communities">
          <div>
            <span className="card-icon" aria-hidden="true">👥</span>
            <h2 style={{ textAlign: 'left', fontSize: '1.2rem', color: 'var(--text)' }}>Communities</h2>
            <p>Join disease-based support communities, share discussions, and connect with others who truly understand your journey.</p>
          </div>
          <Link to="/communities" className="btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} id="dash-btn-communities">
            <i className="fa-solid fa-arrow-right" aria-hidden="true"></i> Open Directory
          </Link>
        </div>

        {/* Find Doctors */}
        <div className="dashboard-card animate-fade-up" style={{ animationDelay: '0.10s', borderTop: '3px solid var(--accent)' }} id="dash-card-doctors">
          <div>
            <span className="card-icon" aria-hidden="true">🩺</span>
            <h2 style={{ textAlign: 'left', fontSize: '1.2rem', color: 'var(--text)' }}>Find Doctors</h2>
            <p>Locate verified medical specialists nearby using symptom-based location search. Book consultations in seconds.</p>
          </div>
          <Link to="/doctor/search" className="btn-teal btn-sm" style={{ alignSelf: 'flex-start', borderRadius: '999px' }} id="dash-btn-doctors">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i> Search Directory
          </Link>
        </div>

        {/* Appointments */}
        <div className="dashboard-card animate-fade-up" style={{ animationDelay: '0.15s', borderTop: '3px solid var(--secondary)' }} id="dash-card-appointments">
          <div>
            <span className="card-icon" aria-hidden="true">📅</span>
            <h2 style={{ textAlign: 'left', fontSize: '1.2rem', color: 'var(--text)' }}>Appointments</h2>
            <p>Schedule virtual consultations and direct chat sessions with verified doctors at your convenience.</p>
          </div>
          <Link to="/appointments-ui" className="btn-success btn-sm" style={{ alignSelf: 'flex-start', borderRadius: '999px' }} id="dash-btn-appointments">
            <i className="fa-solid fa-calendar-plus" aria-hidden="true"></i> Book Consultation
          </Link>
        </div>

        {/* Medicines */}
        <div className="dashboard-card animate-fade-up" style={{ animationDelay: '0.20s', borderTop: '3px solid var(--purple)' }} id="dash-card-medicines">
          <div>
            <span className="card-icon" aria-hidden="true">💊</span>
            <h2 style={{ textAlign: 'left', fontSize: '1.2rem', color: 'var(--text)' }}>Medicines</h2>
            <p>Search prescribed medications, compare dosages, and order medicines from verified online pharmacy partners.</p>
          </div>
          <Link to="/medicine" className="btn-purple btn-sm" style={{ alignSelf: 'flex-start', borderRadius: '999px' }} id="dash-btn-medicines">
            <i className="fa-solid fa-pills" aria-hidden="true"></i> Search Medicines
          </Link>
        </div>

        {/* Mental Wellness */}
        <div className="dashboard-card animate-fade-up" style={{ animationDelay: '0.25s', borderTop: '3px solid var(--warning)' }} id="dash-card-wellness">
          <div>
            <span className="card-icon" aria-hidden="true">🧘</span>
            <h2 style={{ textAlign: 'left', fontSize: '1.2rem', color: 'var(--text)' }}>Mental Wellness</h2>
            <p>Access meditation guides, mood trackers, stress management tools, and professional wellness advice.</p>
          </div>
          <Link to="/wellness" className="btn-warning btn-sm" style={{ alignSelf: 'flex-start', borderRadius: '999px' }} id="dash-btn-wellness">
            <i className="fa-solid fa-seedling" aria-hidden="true"></i> Explore Tools
          </Link>
        </div>

        {/* Health Analytics */}
        <div className="dashboard-card animate-fade-up" style={{ animationDelay: '0.30s', borderTop: '3px solid var(--danger)' }} id="dash-card-analytics">
          <div>
            <span className="card-icon" aria-hidden="true">📊</span>
            <h2 style={{ textAlign: 'left', fontSize: '1.2rem', color: 'var(--text)' }}>Platform Analytics</h2>
            <p>View real-time safety stats, verified discussion metrics, disease prevalence insights, and medical trust scores.</p>
          </div>
          <Link to="/analytics" className="btn-danger btn-sm" style={{ alignSelf: 'flex-start', borderRadius: '999px' }} id="dash-btn-analytics">
            <i className="fa-solid fa-chart-line" aria-hidden="true"></i> View Platform Stats
          </Link>
        </div>
      </div>
    </main>
  );
}
