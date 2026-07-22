import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Button } from '../components/ui';

export default function Dashboard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <main style={{ flex: 1 }}>
      <Container size="xl">
        {/* Personalized Greeting Banner */}
        <div className="dashboard-greeting animate-fade-up" id="greeting-banner" style={{ position: 'relative', overflow: 'hidden', marginBottom: 'var(--space-8)' }}>
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
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-5)' }}>
              <Link to="/communities" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="sm" icon={<i className="fa-solid fa-people-group"></i>} id="dash-cta-communities">
                  Find Your Community
                </Button>
              </Link>
              <Link to="/doctor/search" style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="sm" icon={<i className="fa-solid fa-user-doctor"></i>} id="dash-cta-doctors">
                  Book a Doctor
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }} aria-label="Health stats overview">
          <Card padding="md" style={{ textAlign: 'center' }} hover>
            <div style={{ fontSize: '1.8rem', marginBottom: 'var(--space-1)' }}>👥</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>Join a Group</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Connect with peers</div>
          </Card>
          <Card padding="md" style={{ textAlign: 'center' }} hover>
            <div style={{ fontSize: '1.8rem', marginBottom: 'var(--space-1)' }}>🩺</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-dark)', letterSpacing: '-0.02em' }}>Book a Doc</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Expert guidance</div>
          </Card>
          <Card padding="md" style={{ textAlign: 'center' }} hover>
            <div style={{ fontSize: '1.8rem', marginBottom: 'var(--space-1)' }}>💊</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--secondary-dark)', letterSpacing: '-0.02em' }}>Order Meds</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Fast delivery</div>
          </Card>
          <Card padding="md" style={{ textAlign: 'center' }} hover>
            <div style={{ fontSize: '1.8rem', marginBottom: 'var(--space-1)' }}>🧘</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--warning)', letterSpacing: '-0.02em' }}>Wellness</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Mind & body</div>
          </Card>
        </div>

        {/* Main Dashboard Cards */}
        <div className="dashboard-grid" id="dashboard-main-grid">
          {/* Communities */}
          <div className="dashboard-card animate-fade-up" id="dash-card-communities">
            <div>
              <span className="card-icon" aria-hidden="true">👥</span>
              <h2 style={{ textAlign: 'left', fontSize: '1.2rem', color: 'var(--text)' }}>Communities</h2>
              <p>Join disease-based support communities, share discussions, and connect with others who truly understand your journey.</p>
            </div>
            <Link to="/communities" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
              <Button variant="primary" size="sm" icon={<i className="fa-solid fa-arrow-right"></i>} id="dash-btn-communities">
                Open Directory
              </Button>
            </Link>
          </div>

          {/* Find Doctors */}
          <div className="dashboard-card animate-fade-up" style={{ borderTop: '3px solid var(--accent)' }} id="dash-card-doctors">
            <div>
              <span className="card-icon" aria-hidden="true">🩺</span>
              <h2 style={{ textAlign: 'left', fontSize: '1.2rem', color: 'var(--text)' }}>Find Doctors</h2>
              <p>Locate verified medical specialists nearby using symptom-based location search. Book consultations in seconds.</p>
            </div>
            <Link to="/doctor/search" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
              <Button variant="accent" size="sm" icon={<i className="fa-solid fa-magnifying-glass"></i>} id="dash-btn-doctors">
                Search Directory
              </Button>
            </Link>
          </div>

          {/* Appointments */}
          <div className="dashboard-card animate-fade-up" style={{ borderTop: '3px solid var(--secondary)' }} id="dash-card-appointments">
            <div>
              <span className="card-icon" aria-hidden="true">📅</span>
              <h2 style={{ textAlign: 'left', fontSize: '1.2rem', color: 'var(--text)' }}>Appointments</h2>
              <p>Schedule virtual consultations and direct chat sessions with verified doctors at your convenience.</p>
            </div>
            <Link to="/appointments-ui" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
              <Button variant="secondary" size="sm" icon={<i className="fa-solid fa-calendar-plus"></i>} id="dash-btn-appointments">
                Book Consultation
              </Button>
            </Link>
          </div>

          {/* Medicines */}
          <div className="dashboard-card animate-fade-up" style={{ borderTop: '3px solid var(--accent)' }} id="dash-card-medicines">
            <div>
              <span className="card-icon" aria-hidden="true">💊</span>
              <h2 style={{ textAlign: 'left', fontSize: '1.2rem', color: 'var(--text)' }}>Medicines</h2>
              <p>Search prescribed medications, compare dosages, and order medicines from verified online pharmacy partners.</p>
            </div>
            <Link to="/medicine" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
              <Button variant="accent" size="sm" icon={<i className="fa-solid fa-pills"></i>} id="dash-btn-medicines">
                Search Medicines
              </Button>
            </Link>
          </div>

          {/* Mental Wellness */}
          <div className="dashboard-card animate-fade-up" style={{ borderTop: '3px solid var(--warning)' }} id="dash-card-wellness">
            <div>
              <span className="card-icon" aria-hidden="true">🧘</span>
              <h2 style={{ textAlign: 'left', fontSize: '1.2rem', color: 'var(--text)' }}>Mental Wellness</h2>
              <p>Access meditation guides, mood trackers, stress management tools, and professional wellness advice.</p>
            </div>
            <Link to="/wellness" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
              <Button variant="warning" size="sm" icon={<i className="fa-solid fa-seedling"></i>} id="dash-btn-wellness">
                Explore Tools
              </Button>
            </Link>
          </div>

          {/* Health Analytics */}
          <div className="dashboard-card animate-fade-up" style={{ borderTop: '3px solid var(--danger)' }} id="dash-card-analytics">
            <div>
              <span className="card-icon" aria-hidden="true">📊</span>
              <h2 style={{ textAlign: 'left', fontSize: '1.2rem', color: 'var(--text)' }}>Platform Analytics</h2>
              <p>View real-time safety stats, verified discussion metrics, disease prevalence insights, and medical trust scores.</p>
            </div>
            <Link to="/analytics" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
              <Button variant="danger" size="sm" icon={<i className="fa-solid fa-chart-line"></i>} id="dash-btn-analytics">
                View Platform Stats
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
