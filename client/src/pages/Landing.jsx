import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main style={{ minHeight: '80vh', paddingTop: '10px' }}>
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
      <section className="page-container" style={{ paddingTop: '64px', paddingBottom: '96px' }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 52px', padding: '0 16px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '14px' }}>
            Everything you need in one compassionate space
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, textAlign: 'center', margin: 0 }}>
            Designed alongside patients and doctors to provide complete physical, mental, and social support.
          </p>
        </div>

        <div className="landing-features-grid">
          {/* Card 1: Peer Communities */}
          <div className="landing-feature-card animate-fade-up">
            <div className="landing-feature-icon" style={{ background: '#eff6ff', border: '1.5px solid #dbeafe', color: '#2563eb' }}>
              👥
            </div>
            <h3>Disease-Specific Communities</h3>
            <p>
              Share stories, exchange advice, and discuss treatment plans with peers who truly understand living with your condition.
            </p>
            <Link to="/register" className="btn btn-primary">
              Explore Groups <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
            </Link>
          </div>

          {/* Card 2: Verified Doctors */}
          <div className="landing-feature-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="landing-feature-icon" style={{ background: '#f0fdf4', border: '1.5px solid #ccfbf1', color: '#0d9488' }}>
              🩺
            </div>
            <h3>Verified Doctors Directory</h3>
            <p>
              Find experienced specialists nearby by location and disease focus. Book instant virtual consultations.
            </p>
            <Link to="/register" className="btn btn-teal">
              Find Doctors <i className="fa-solid fa-magnifying-glass" style={{ marginLeft: '6px' }}></i>
            </Link>
          </div>

          {/* Card 3: Mental Wellness */}
          <div className="landing-feature-card animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="landing-feature-icon" style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', color: '#10b981' }}>
              🧘
            </div>
            <h3>Mental Wellness & Tracking</h3>
            <p>
              Access guided meditations, mood logs, medication reminders, and mental health tools tailored for chronic illness care.
            </p>
            <Link to="/register" className="btn btn-success">
              Start Wellness <i className="fa-solid fa-heart" style={{ marginLeft: '6px' }}></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency CTA Banner */}
      <section style={{ background: 'var(--danger-bg)', borderTop: '1px solid rgba(239,68,68,0.15)', borderBottom: '1px solid rgba(239,68,68,0.15)', padding: '32px 24px' }}>
        <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', background: 'var(--danger)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>
              <i className="fa-solid fa-phone" style={{ color: 'white', fontSize: '1rem' }}></i>
            </div>
            <div>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--danger)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '3px' }}>
                24/7 Emergency Helpline
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>
                Need urgent help? Connect immediately to emergency services.
              </p>
            </div>
          </div>
          <a href="tel:112" className="btn btn-danger btn-sm" style={{ borderRadius: '999px', gap: '8px', padding: '10px 24px', flexShrink: 0 }}>
            <i className="fa-solid fa-phone-volume"></i> Call 112
          </a>
        </div>
      </section>
    </main>
  );
}
