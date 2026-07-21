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
            You don’t have to fight your illness <span className="highlight">alone.</span>
          </h1>

          <p className="hero-subtitle">
            Connect with peer support communities, consult verified medical specialists,
            track medicines, and access mental wellness resources built for your journey.
          </p>

          <div className="hero-cta">
            <Link to="/register" className="btn-primary btn-lg" style={{ borderRadius: '999px' }}>
              <i className="fa-solid fa-user-plus"></i> Join Empathezee Free
            </Link>
            <Link to="/login" className="btn-outline btn-lg" style={{ borderRadius: '999px' }}>
              <i className="fa-solid fa-right-to-bracket"></i> Member Login
            </Link>
            <Link to="/doctor/login" className="btn-secondary btn-lg" style={{ borderRadius: '999px' }}>
              <i className="fa-solid fa-stethoscope"></i> Doctor Portal
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">10k+</div>
              <div className="hero-stat-label">Active Peers</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">250+</div>
              <div className="hero-stat-label">Verified Doctors</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">50+</div>
              <div className="hero-stat-label">Support Groups</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">24/7</div>
              <div className="hero-stat-label">Emergency & SOS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="page-container" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '12px' }}>Comprehensive Care</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
            Everything you need in one compassionate space
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '8px' }}>
            Designed alongside patients and doctors to provide complete physical, mental, and social support.
          </p>
        </div>

        <div className="dashboard-grid">
          {/* Card 1: Peer Communities */}
          <div className="dashboard-card animate-fade-up">
            <span className="card-icon" aria-hidden="true">👥</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
              Disease-Specific Communities
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, flexGrow: 1 }}>
              Share stories, exchange advice, and discuss treatment plans with peers who truly understand living with your condition.
            </p>
            <Link to="/register" className="btn-primary btn-sm" style={{ marginTop: '16px', alignSelf: 'flex-start' }}>
              Explore Groups <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          {/* Card 2: Verified Doctors */}
          <div className="dashboard-card animate-fade-up" style={{ animationDelay: '0.1s', borderTop: '3px solid var(--accent)' }}>
            <span className="card-icon" aria-hidden="true">🩺</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
              Verified Doctors Directory
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, flexGrow: 1 }}>
              Find experienced specialists nearby by location and disease focus. Book instant virtual consultations.
            </p>
            <Link to="/register" className="btn-teal btn-sm" style={{ marginTop: '16px', alignSelf: 'flex-start', borderRadius: '999px' }}>
              Find Doctors <i className="fa-solid fa-magnifying-glass"></i>
            </Link>
          </div>

          {/* Card 3: Mental Wellness */}
          <div className="dashboard-card animate-fade-up" style={{ animationDelay: '0.2s', borderTop: '3px solid var(--secondary)' }}>
            <span className="card-icon" aria-hidden="true">🧘</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
              Mental Wellness & Tracking
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, flexGrow: 1 }}>
              Access guided meditations, mood logs, medication reminders, and mental health tools tailored for chronic illness care.
            </p>
            <Link to="/register" className="btn-success btn-sm" style={{ marginTop: '16px', alignSelf: 'flex-start', borderRadius: '999px' }}>
              Start Wellness <i className="fa-solid fa-heart"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency CTA Banner */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '48px 24px' }}>
        <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
              <i className="fa-solid fa-shield-halved"></i> 24/7 EMERGENCY HELPLINE INTEGRATED
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>
              Need urgent medical help?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Connect immediately to local emergency services directly through Empathezee.
            </p>
          </div>
          <a href="tel:112" className="btn-danger btn-lg" style={{ borderRadius: '999px', gap: '10px' }}>
            <i className="fa-solid fa-phone-volume"></i> Emergency Call 112
          </a>
        </div>
      </section>
    </main>
  );
}
