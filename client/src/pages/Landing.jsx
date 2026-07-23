import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main style={{ minHeight: '80vh' }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <i className="fa-solid fa-heart-pulse"></i>
            <span>Empowering Chronic Illness Support</span>
          </div>

          <h1 className="hero-title">
            You don't have to fight your illness <span className="highlight">alone.</span>
          </h1>

          <p className="hero-subtitle">
            Connect with peer support communities, consult verified medical specialists,
            track medicines, and access mental wellness resources built for your journey.
          </p>

          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg" style={{ borderRadius: '999px' }}>
              <i className="fa-solid fa-user-plus"></i> Join Empathezee Free
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg" style={{ borderRadius: '999px' }}>
              <i className="fa-solid fa-right-to-bracket"></i> Member Login
            </Link>
            <Link to="/doctor/login" className="btn btn-ghost btn-lg" style={{ borderRadius: '999px' }}>
              <i className="fa-solid fa-stethoscope"></i> Doctor Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="page-container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', textAlign: 'center' }}>
            Everything you need in one compassionate space
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '8px', textAlign: 'center' }}>
            Designed alongside patients and doctors to provide complete physical, mental, and social support.
          </p>
        </div>

        <div className="landing-features-grid">
          {/* Card 1: Peer Communities */}
          <div className="dashboard-card animate-fade-up">
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '16px' }}>
              👥
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px', textAlign: 'left' }}>
              Disease-Specific Communities
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, flexGrow: 1, textAlign: 'left', margin: 0 }}>
              Share stories, exchange advice, and discuss treatment plans with peers who truly understand living with your condition.
            </p>
            <Link to="/register" className="btn btn-primary btn-sm" style={{ marginTop: '20px', alignSelf: 'flex-start', borderRadius: '999px' }}>
              Explore Groups <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          {/* Card 2: Verified Doctors */}
          <div className="dashboard-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--accent-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '16px' }}>
              🩺
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px', textAlign: 'left' }}>
              Verified Doctors Directory
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, flexGrow: 1, textAlign: 'left', margin: 0 }}>
              Find experienced specialists nearby by location and disease focus. Book instant virtual consultations.
            </p>
            <Link to="/register" className="btn btn-teal btn-sm" style={{ marginTop: '20px', alignSelf: 'flex-start', borderRadius: '999px' }}>
              Find Doctors <i className="fa-solid fa-magnifying-glass"></i>
            </Link>
          </div>

          {/* Card 3: Mental Wellness */}
          <div className="dashboard-card animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--secondary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '16px' }}>
              🧘
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px', textAlign: 'left' }}>
              Mental Wellness & Tracking
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, flexGrow: 1, textAlign: 'left', margin: 0 }}>
              Access guided meditations, mood logs, medication reminders, and mental health tools tailored for chronic illness care.
            </p>
            <Link to="/register" className="btn btn-success btn-sm" style={{ marginTop: '20px', alignSelf: 'flex-start', borderRadius: '999px' }}>
              Start Wellness <i className="fa-solid fa-heart"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency CTA Banner — compact */}
      <section style={{ background: 'var(--danger-bg)', borderTop: '1px solid rgba(239,68,68,0.15)', borderBottom: '1px solid rgba(239,68,68,0.15)', padding: '28px 24px' }}>
        <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--danger)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fa-solid fa-phone" style={{ color: 'white', fontSize: '0.95rem' }}></i>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '2px' }}>
                24/7 Emergency Helpline
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Need urgent help? Connect immediately to emergency services.
              </p>
            </div>
          </div>
          <a href="tel:112" className="btn btn-danger btn-sm" style={{ borderRadius: '999px', gap: '8px', flexShrink: 0 }}>
            <i className="fa-solid fa-phone-volume"></i> Call 112
          </a>
        </div>
      </section>
    </main>
  );
}
