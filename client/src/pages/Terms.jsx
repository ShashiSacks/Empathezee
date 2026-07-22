import React from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="page-container" style={{ maxWidth: '860px', paddingTop: '40px', paddingBottom: '60px' }}>
      
      {/* Header Banner */}
      <div className="card" style={{ padding: '36px', marginBottom: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--surface) 0%, var(--primary-50) 100%)', border: '1px solid var(--border)' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '16px', fontSize: '1.5rem', marginInline: 'auto' }}>
          <i className="fa-solid fa-file-contract"></i>
        </div>
        <h1 className="title" style={{ margin: '0 0 8px', fontSize: '2rem', textAlign: 'center' }}>Terms & Conditions</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, maxWidth: '600px', textAlign: 'center' }}>
          Effective Date: July 22, 2026. Please read these terms carefully before using the Empathezee healthcare platform.
        </p>
      </div>

      {/* Content Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Section 1: Overview */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ fontSize: '1.2rem', color: 'var(--primary)' }}><i className="fa-solid fa-heart-pulse"></i></span>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>1. Platform Purpose & Acceptance</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Empathezee is a digital healthcare community platform designed to foster peer support, wellness tracking, verified doctor search, and health education. By accessing or using Empathezee, you agree to comply with and be bound by these Terms & Conditions.
          </p>
        </div>

        {/* Section 2: Medical Disclaimer */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ fontSize: '1.2rem', color: 'var(--warning)' }}><i className="fa-solid fa-triangle-exclamation"></i></span>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>2. Emergency & Medical Disclaimer</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Empathezee does NOT provide direct emergency medical treatment. Content shared in community discussions, wellness guides, or platform articles is for informational and emotional support purposes only. In the event of a medical emergency, immediately contact local emergency services (Helpline: <strong>112</strong>).
          </p>
        </div>

        {/* Section 3: Community Safety & Moderation */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}><i className="fa-solid fa-shield-halved"></i></span>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>3. User Conduct & Community Guidelines</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            All users must maintain an atmosphere of empathy, respect, and safety. Misinformation, unverified prescription sales, harassment, and hate speech are strictly prohibited. Our automated content filtering system monitors community posts to ensure platform safety.
          </p>
        </div>

        {/* Section 4: Privacy & Data Protection */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ fontSize: '1.2rem', color: 'var(--accent)' }}><i className="fa-solid fa-lock"></i></span>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>4. Data Privacy & Confidentiality</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Your medical privacy is paramount. Personal health data, consultation logs, and private messages are encrypted and handled in compliance with global health data standards. We never sell user health records to third-party advertisers.
          </p>
        </div>

      </div>
    </div>
  );
}
