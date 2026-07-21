import React, { useState } from 'react';

const AFFIRMATIONS = [
  '"I am stronger than my illness. Every day I choose to keep going is a victory."',
  '"My body deserves rest, patience, and love."',
  '"I am not defined by my condition, but by how I choose to live."',
  '"One day at a time, one breath at a time. I am doing enough."',
  '"Healing takes time, and giving myself grace is part of the journey."',
];

export default function Wellness() {
  const [affirmationIdx, setAffirmationIdx] = useState(0);
  const [breathText, setBreathText] = useState('Press Start');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathScale, setBreathScale] = useState(1);

  const nextAffirmation = () => {
    setAffirmationIdx((prev) => (prev + 1) % AFFIRMATIONS.length);
  };

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathText('Inhale...');
    setBreathScale(1.4);
    setTimeout(() => {
      setBreathText('Hold...');
      setTimeout(() => {
        setBreathText('Exhale...');
        setBreathScale(1);
        setTimeout(() => {
          setBreathText('Rest');
        }, 4000);
      }, 4000);
    }, 4000);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setBreathText('Press Start');
    setBreathScale(1);
  };

  return (
    <main>
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(145deg, #F5F3FF 0%, #FFF7ED 50%, #F0FDFA 100%)', padding: '64px 24px 52px', textAlign: 'center', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.18)', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, color: '#7C3AED', marginBottom: '20px' }}>
            <i className="fa-solid fa-seedling"></i> Mental Wellness Centre
          </div>
          <h1 className="title" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', marginBottom: '12px' }}>
            Your <span style={{ background: 'linear-gradient(135deg,#8B5CF6,#14B8A6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Mind Matters</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 0 }}>
            Living with a chronic illness is hard — but you don't have to do it alone. Take a moment to breathe, reflect, and find calm.
          </p>
        </div>
      </div>

      <div className="page-container" style={{ paddingTop: '48px' }}>
        {/* Daily Affirmation Card */}
        <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)', borderRadius: 'var(--radius-2xl)', padding: '40px 36px', textAlign: 'center', color: 'white', marginBottom: '48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>💫</div>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '12px' }}>Today's Affirmation</p>
            <blockquote style={{ fontSize: 'clamp(1.1rem,2.5vw,1.4rem)', fontWeight: 700, lineHeight: 1.5, fontStyle: 'italic', margin: '0 0 20px' }}>
              {AFFIRMATIONS[affirmationIdx]}
            </blockquote>
            <button onClick={nextAffirmation} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', borderRadius: '999px', padding: '9px 20px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
              <i className="fa-solid fa-rotate"></i> New Affirmation
            </button>
          </div>
        </div>

        {/* Section Label */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>Wellness Tools</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Simple practices to help you feel calmer and more grounded</p>
        </div>

        {/* Wellness Tools Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '24px', marginBottom: '56px' }}>
          {/* Box Breathing */}
          <div className="card" style={{ padding: '24px', textAlign: 'center', borderTop: '3px solid #8B5CF6' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 16px' }}>🫁</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '6px', color: 'var(--text)' }}>Box Breathing</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '20px' }}>A proven technique to reduce anxiety and calm your nervous system in just 2 minutes.</p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8B5CF6, #2563EB)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: 700,
                transform: `scale(${breathScale})`,
                transition: 'transform 4s ease',
              }}>
                {breathText}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={startBreathing} className="btn-sm" style={{ borderRadius: '999px', background: '#8B5CF6', color: 'white', border: 'none', padding: '8px 18px', fontSize: '0.82rem', cursor: 'pointer' }}>
                  <i className="fa-solid fa-play"></i> Start
                </button>
                <button onClick={stopBreathing} className="btn-sm btn-outline" style={{ borderRadius: '999px', fontSize: '0.82rem', cursor: 'pointer' }}>
                  <i className="fa-solid fa-stop"></i> Stop
                </button>
              </div>
            </div>
          </div>

          {/* Guided Meditation */}
          <div className="card" style={{ padding: '24px', textAlign: 'center', borderTop: '3px solid var(--accent)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 16px' }}>🧘</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '6px', color: 'var(--text)' }}>Guided Mindfulness</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '20px' }}>Set a quiet space for meditation, journaling, or mindful rest. No pressure, just peace.</p>
            <div style={{ background: 'var(--bg-warm)', padding: '12px', borderRadius: 'var(--radius)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              "Inhale peace, exhale tension. Allow your mind to settle into this moment."
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
