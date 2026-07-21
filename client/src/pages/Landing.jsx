import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Stethoscope, Sparkles } from 'lucide-react';
import './Landing.css'; // Might keep for specific grid but rely mostly on index.css

const Landing = () => {
  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">
            You don't have to fight your illness <span className="highlight">alone.</span>
          </h1>
          <p className="hero-subtitle">
            Empathezee is a premium healthcare community platform connecting people with chronic illnesses to support communities, verified doctors, and mental wellness resources. Join us to find the support you deserve.
          </p>
          
          <div className="hero-cta">
            <Link to="/login" className="btn-outline btn-lg">
              Log In
            </Link>
            <Link to="/register" className="btn-primary btn-lg">
              Sign Up for Free
            </Link>
          </div>
        </div>
      </section>

      <section className="page-container" aria-label="Platform features" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="card card-featured">
            <div className="card-body" style={{ alignItems: 'center', textAlign: 'center' }}>
              <div style={{ padding: '16px', background: 'var(--primary-50)', borderRadius: '20px', color: 'var(--primary)', marginBottom: '24px' }}>
                <Users size={40} />
              </div>
              <h3 className="feature-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Support Communities</h3>
              <p className="feature-desc" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Connect with patients who truly understand your journey. Share experiences and find emotional support in dedicated groups.</p>
            </div>
          </div>
          
          <div className="card card-featured-teal">
            <div className="card-body" style={{ alignItems: 'center', textAlign: 'center' }}>
              <div style={{ padding: '16px', background: 'var(--accent-50)', borderRadius: '20px', color: 'var(--accent-dark)', marginBottom: '24px' }}>
                <Stethoscope size={40} />
              </div>
              <h3 className="feature-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Verified Doctors</h3>
              <p className="feature-desc" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Consult with top-rated, verified medical specialists. Book appointments instantly and securely from anywhere.</p>
            </div>
          </div>
          
          <div className="card card-featured-green">
            <div className="card-body" style={{ alignItems: 'center', textAlign: 'center' }}>
              <div style={{ padding: '16px', background: 'var(--secondary-50)', borderRadius: '20px', color: 'var(--secondary-dark)', marginBottom: '24px' }}>
                <Sparkles size={40} />
              </div>
              <h3 className="feature-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Mental Wellness</h3>
              <p className="feature-desc" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Access curated mental health resources, mood tracking tools, and guided exercises to support your holistic well-being.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;
