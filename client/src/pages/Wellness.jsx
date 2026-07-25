import React, { useState } from 'react';
import { Container, Card, Button, PageHeader } from '../components/ui';

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
    <main style={{ flex: 1 }}>
      <PageHeader
        badge={<><i className="fa-solid fa-seedling"></i> Mental Wellness Centre</>}
        title="Your"
        highlight="Mind Matters"
        subtitle="Living with a chronic illness is hard — but you don't have to do it alone. Take a moment to breathe, reflect, and find calm."
        gradient="warm"
      />

      <Container size="lg">
        {/* Daily Affirmation Card */}
        <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-10) var(--space-8)', textAlign: 'center', color: 'white', marginBottom: 'var(--space-10)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>💫</div>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.8, marginBottom: 'var(--space-3)' }}>Today's Affirmation</p>
            <blockquote style={{ fontSize: 'clamp(1.1rem,2.5vw,1.4rem)', fontWeight: 700, lineHeight: 1.5, fontStyle: 'italic', margin: '0 0 var(--space-5)' }}>
              {AFFIRMATIONS[affirmationIdx]}
            </blockquote>
            <Button onClick={nextAffirmation} variant="ghost" size="sm" icon={<i className="fa-solid fa-rotate"></i>} style={{ color: 'white', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)' }}>
              New Affirmation
            </Button>
          </div>
        </div>

        {/* Section Label */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: 'var(--space-1)' }}>Wellness Tools</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Simple practices to help you feel calmer and more grounded</p>
        </div>

        {/* Wellness Tools Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
          {/* Box Breathing */}
          <Card padding="lg" style={{ textAlign: 'center' }} accentBorder="purple">
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto var(--space-4)' }}>🫁</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 'var(--space-2)', color: 'var(--text)', textAlign: 'center' }}>Box Breathing</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 'var(--space-5)' }}>A proven technique to reduce anxiety and calm your nervous system in just 2 minutes.</p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
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
                transition: 'transform 4s ease-in-out',
                transform: `scale(${breathScale})`,
                boxShadow: 'var(--shadow-blue)',
              }}>
                {breathText}
              </div>

              {!isBreathing ? (
                <Button onClick={startBreathing} variant="primary" size="sm" icon={<i className="fa-solid fa-play"></i>}>
                  Start Exercise
                </Button>
              ) : (
                <Button onClick={stopBreathing} variant="danger" size="sm" icon={<i className="fa-solid fa-stop"></i>}>
                  Stop Exercise
                </Button>
              )}
            </div>
          </Card>

          {/* Peer Support */}
          <Card padding="lg" style={{ textAlign: 'center' }} accentBorder="accent">
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto var(--space-4)' }}>💬</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 'var(--space-2)', color: 'var(--text)', textAlign: 'center' }}>Peer Support</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 'var(--space-5)' }}>Share how you are feeling with someone who truly understands chronic health challenges.</p>
            <Button variant="accent" size="sm" icon={<i className="fa-solid fa-people-group"></i>}>
              Join Support Group
            </Button>
          </Card>

          {/* Emergency Helpline */}
          <Card padding="lg" style={{ textAlign: 'center' }} accentBorder="danger">
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto var(--space-4)' }}>📞</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 'var(--space-2)', color: 'var(--text)', textAlign: 'center' }}>24/7 Helpline</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 'var(--space-5)' }}>If you're in distress or need immediate mental health support, professional help is 1 call away.</p>
            <Button variant="danger" size="sm" icon={<i className="fa-solid fa-phone"></i>}>
              Call 112
            </Button>
          </Card>
        </div>
      </Container>
    </main>
  );
}
