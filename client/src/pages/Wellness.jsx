import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  RefreshCw, Play, Square, Pause, RotateCcw, 
  Users, Stethoscope, Phone, AlertTriangle, Sparkles 
} from 'lucide-react';

const affirmationsList = [
  "I am stronger than my illness. Every day I choose to keep going is a victory.",
  "My worth is not defined by my diagnosis. I am so much more than my condition.",
  "Healing is not linear. It's okay to have difficult days — they do not erase my progress.",
  "I deserve rest, care, and compassion — especially from myself.",
  "I am allowed to ask for help. Reaching out is a sign of courage, not weakness.",
  "My body is doing its best. I honor it with kindness and patience.",
  "Every small step matters. Progress isn't always visible, but it's always happening.",
  "I am not fighting alone. My community stands with me.",
  "This moment of difficulty will pass. I have survived every hard day before today.",
  "I choose hope. Not because it's easy, but because I deserve it.",
  "My illness is a part of my story, not the whole story.",
  "Gratitude and pain can coexist. I can acknowledge the struggle and still find light."
];

const moodResponses = {
  "Good":       "That's wonderful! 🌟 Keep nurturing what's working for you today.",
  "Okay":       "That's completely valid. 💙 Take things one step at a time.",
  "Low":        "It's okay to not be okay. 🤍 Consider taking a breathing break or reaching out to someone.",
  "Struggling": "We hear you. 💜 Please consider calling the helpline below — you deserve support.",
  "Grateful":   "Gratitude is powerful medicine. 🌸 Hold onto that feeling.",
  "Tired":      "Rest is healing. 😴 Be gentle with yourself today — you're doing enough."
};

const Wellness = () => {
  // Affirmations State
  const [affirmationIdx, setAffirmationIdx] = useState(0);
  const [affirmationOpacity, setAffirmationOpacity] = useState(1);

  const getNewAffirmation = () => {
    setAffirmationOpacity(0);
    setTimeout(() => {
      setAffirmationIdx(prev => (prev + 1) % affirmationsList.length);
      setAffirmationOpacity(1);
    }, 200);
  };

  // Breathing State
  const [breathingLabel, setBreathingLabel] = useState("Press Start");
  const [breathingTransform, setBreathingTransform] = useState("scale(1)");
  const [breathingShadow, setBreathingShadow] = useState("none");
  const breathingIntervalRef = useRef(null);
  
  const phases = [
    { label: "Breathe In", duration: 4000 },
    { label: "Hold",       duration: 4000 },
    { label: "Breathe Out",duration: 4000 },
    { label: "Hold",       duration: 4000 }
  ];
  const phaseIdxRef = useRef(0);

  const startBreathing = () => {
    if (breathingIntervalRef.current) return;
    runBreathPhase();
    breathingIntervalRef.current = setInterval(runBreathPhase, 4000);
  };

  const runBreathPhase = () => {
    const phase = phases[phaseIdxRef.current % phases.length];
    setBreathingLabel(phase.label);

    if (phase.label === "Breathe In") {
      setBreathingTransform("scale(1.5)");
      setBreathingShadow("0 0 0 16px rgba(139,92,246,0.15)");
    } else if (phase.label === "Breathe Out") {
      setBreathingTransform("scale(1)");
      setBreathingShadow("0 0 0 0 rgba(139,92,246,0)");
    }
    
    phaseIdxRef.current++;
  };

  const stopBreathing = () => {
    if (breathingIntervalRef.current) {
      clearInterval(breathingIntervalRef.current);
      breathingIntervalRef.current = null;
    }
    setBreathingLabel("Press Start");
    setBreathingTransform("scale(1)");
    setBreathingShadow("none");
    phaseIdxRef.current = 0;
  };

  useEffect(() => {
    return () => {
      if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);
    };
  }, []);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(5 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const timerIntervalRef = useRef(null);
  const [timerLabel, setTimerLabel] = useState("05:00");

  useEffect(() => {
    const m = Math.floor(timerSeconds / 60).toString().padStart(2, "0");
    const s = (timerSeconds % 60).toString().padStart(2, "0");
    setTimerLabel(`${m}:${s}`);
  }, [timerSeconds]);

  const handleSetTimer = (minutes) => {
    handleResetTimer(minutes);
  };

  const startTimer = () => {
    if (timerRunning) {
      // Pause functionality
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setTimerRunning(false);
      return;
    }
    
    setTimerRunning(true);
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          setTimerRunning(false);
          setTimerLabel("Done! 🎉");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResetTimer = (minutes = selectedMinutes) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimerRunning(false);
    setSelectedMinutes(minutes);
    setTimerSeconds(minutes * 60);
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Mood State
  const [selectedMood, setSelectedMood] = useState("");
  const [moodResponseText, setMoodResponseText] = useState("");

  const handleSelectMood = (label) => {
    setSelectedMood(label);
    setMoodResponseText(moodResponses[label] || "Thank you for checking in. 💙");
  };

  return (
    <main>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(145deg, #F5F3FF 0%, #FFF7ED 50%, #F0FDFA 100%)',
        padding: '64px 24px 52px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '-30px', right: '-30px', width: '220px', height: '220px', background: 'radial-gradient(circle,rgba(139,92,246,0.07),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-40px', left: '-20px', width: '200px', height: '200px', background: 'radial-gradient(circle,rgba(20,184,166,0.07),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.18)', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, color: '#7C3AED', marginBottom: '20px' }}>
            <Sparkles size={14} /> Mental Wellness Centre
          </div>
          <h1 className="title" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', marginBottom: '12px' }}>
            Your <span style={{ background: 'linear-gradient(135deg,#8B5CF6,#14B8A6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mind Matters</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 0 }}>
            Living with a chronic illness is hard — but you don't have to do it alone. Take a moment to breathe, reflect, and find calm.
          </p>
        </div>
      </div>

      <div className="page-container" style={{ paddingTop: '48px' }}>
        {/* Daily Affirmation Card */}
        <div style={{
          background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
          borderRadius: 'var(--radius-2xl)',
          padding: '40px 36px',
          textAlign: 'center',
          color: 'white',
          marginBottom: '48px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
          <div aria-hidden="true" style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }}></div>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>💫</div>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '12px' }}>Today's Affirmation</p>
            <blockquote style={{ fontSize: 'clamp(1.1rem,2.5vw,1.4rem)', fontWeight: 700, lineHeight: 1.5, letterSpacing: '-0.02em', fontStyle: 'italic', margin: '0 0 20px', opacity: affirmationOpacity, transition: 'opacity 0.2s' }}>
              "{affirmationsList[affirmationIdx]}"
            </blockquote>
            <button onClick={getNewAffirmation} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', borderRadius: '999px', padding: '9px 20px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              <RefreshCw size={14} /> New Affirmation
            </button>
          </div>
        </div>

        {/* Section Label */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text)', marginBottom: '6px' }}>Wellness Tools</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Simple practices to help you feel calmer and more grounded</p>
        </div>

        {/* Wellness Tools Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '24px', marginBottom: '56px' }}>
          
          {/* Breathing Exercise */}
          <div className="card" style={{ borderTop: '4px solid #8B5CF6' }}>
            <div className="card-body">
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '16px' }}>🫁</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '8px', color: 'var(--text)' }}>Box Breathing</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>A proven technique to reduce anxiety and calm your nervous system in just 2 minutes.</p>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: 'auto' }}>
                <div style={{
                  width: '100px', height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8B5CF6, #2563EB)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '0.85rem', fontWeight: 700,
                  transition: 'transform 4s ease, opacity 4s ease',
                  boxShadow: breathingShadow,
                  cursor: 'pointer',
                  transform: breathingTransform
                }}>
                  {breathingLabel}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={startBreathing} className="btn-primary btn-sm" style={{ background: '#8B5CF6', borderColor: '#8B5CF6', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Play size={14} /> Start
                  </button>
                  <button onClick={stopBreathing} className="btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Square size={14} /> Stop
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Meditation Timer */}
          <div className="card" style={{ borderTop: '4px solid var(--accent)' }}>
            <div className="card-body">
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--accent-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '16px' }}>🧘</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '8px', color: 'var(--text)' }}>Meditation Timer</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>Set a quiet timer for meditation, journaling, or mindful rest. No pressure, just peace.</p>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: 'auto' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--accent-dark)', fontVariantNumeric: 'tabular-nums' }}>
                  {timerLabel}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {[5, 10, 15, 20].map(mins => (
                    <button key={mins} onClick={() => handleSetTimer(mins)} className={`filter-pill ${selectedMinutes === mins ? 'active' : ''}`}>
                      {mins} min
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button onClick={startTimer} className="btn-teal btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {timerRunning ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Start</>}
                  </button>
                  <button onClick={() => handleResetTimer()} className="btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RotateCcw size={14} /> Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sleep Help */}
          <div className="card" style={{ borderTop: '4px solid #0EA5E9' }}>
            <div className="card-body">
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '16px' }}>😴</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '8px', color: 'var(--text)' }}>Better Sleep Guide</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>Chronic illness often disrupts sleep. These science-backed tips can help you rest better.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                {[
                  { icon: '🌡️', tip: 'Keep your room cool (16–19°C is ideal)' },
                  { icon: '📵', tip: 'Avoid screens 30 min before bed' },
                  { icon: '🛁', tip: 'Warm bath 1 hour before helps melatonin' },
                  { icon: '📔', tip: 'Write 3 gratitudes in a journal before sleep' },
                  { icon: '🎵', tip: 'Try white noise or nature sounds' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ width: '32px', height: '32px', background: '#F0F9FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '4px' }}>{item.tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stress Management */}
          <div className="card" style={{ borderTop: '4px solid var(--secondary)' }}>
            <div className="card-body">
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--secondary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '16px' }}>🌿</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '8px', color: 'var(--text)' }}>Stress Management</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>Managing stress is critical for chronic illness. Try these evidence-based techniques.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                {[
                  { icon: '🚶', tip: '10-minute walk in nature lowers cortisol' },
                  { icon: '✍️', tip: 'Expressive writing reduces anxiety' },
                  { icon: '🤝', tip: 'Talking to your community helps healing' },
                  { icon: '🎨', tip: 'Creative hobbies are natural stress-busters' },
                  { icon: '🌞', tip: 'Morning sunlight regulates your stress hormones' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ width: '32px', height: '32px', background: 'var(--secondary-50)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '4px' }}>{item.tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mood Tracker */}
          <div className="card" style={{ borderTop: '4px solid var(--warning)' }}>
            <div className="card-body">
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '16px' }}>🎯</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '8px', color: 'var(--text)' }}>Mood Check-In</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>How are you feeling right now? Recognizing your emotions is the first step to wellness.</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: 'auto' }}>
                {[
                  { emoji: '😊', label: 'Good' },
                  { emoji: '😐', label: 'Okay' },
                  { emoji: '😔', label: 'Low' },
                  { emoji: '😣', label: 'Struggling' },
                  { emoji: '🙏', label: 'Grateful' },
                  { emoji: '😴', label: 'Tired' }
                ].map(m => {
                  const isActive = selectedMood === m.label;
                  return (
                    <button
                      key={m.label}
                      onClick={() => handleSelectMood(m.label)}
                      className="mood-btn"
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                        padding: '12px 16px', borderRadius: '12px',
                        background: isActive ? 'var(--primary-50)' : 'var(--bg-warm)',
                        border: '1.5px solid',
                        borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                        color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                        cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                        transition: 'all 0.2s',
                        transform: isActive ? 'scale(1.05)' : 'scale(1)'
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{m.emoji}</span>
                      {m.label}
                    </button>
                  );
                })}
              </div>
              <p style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', minHeight: '24px', fontWeight: 500 }}>
                {moodResponseText}
              </p>
            </div>
          </div>

          {/* Community Support */}
          <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
            <div className="card-body">
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '16px' }}>💙</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '8px', color: 'var(--text)' }}>You're Not Alone</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>Connecting with others who truly understand your journey is one of the most powerful forms of healing.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                <Link to="/communities" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px' }}>
                  <Users size={16} /> Find a Support Community
                </Link>
                <Link to="/doctor/search" className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px' }}>
                  <Stethoscope size={16} /> Talk to a Doctor
                </Link>
                
                <div style={{ marginTop: '8px', padding: '16px', background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={20} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--danger)', marginBottom: '2px' }}>Mental Health Helpline</div>
                    <a href="tel:1800111565" style={{ fontSize: '0.9rem', color: 'var(--danger)', fontWeight: 600, textDecoration: 'none' }}>1800-111-565 <span style={{ fontWeight: 400, fontSize: '0.8rem' }}>(Free, 24/7)</span></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Inspirational Stories */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text)', marginBottom: '6px' }}>Stories of Hope</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real journeys from our community — because healing is possible</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '24px' }}>
            {[
              {
                name: 'Priya S.', condition: 'Type 2 Diabetes', avatar: '🌸',
                quote: "Joining the Empathezee community changed everything. I finally found people who understand the daily challenges of managing diabetes. I feel less alone.",
                months: '8 months member'
              },
              {
                name: 'Rajan M.', condition: 'Heart Disease', avatar: '🦁',
                quote: "After my cardiac event, I was terrified and isolated. The community here helped me find doctors, understand my condition, and most importantly — hope.",
                months: '14 months member'
              },
              {
                name: 'Ananya K.', condition: 'PCOS', avatar: '✨',
                quote: "The wellness resources and community support on Empathezee helped me understand my body better and find balance I didn't know was possible.",
                months: '5 months member'
              }
            ].map((story, idx) => (
              <div key={idx} className="card">
                <div className="card-body" style={{ alignItems: 'center', textAlign: 'center', padding: '32px 24px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{story.avatar}</div>
                  <p style={{ fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '24px' }}>"{story.quote}"</p>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '4px' }}>{story.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{story.condition}</span>
                    <span style={{ color: 'var(--border)' }}>·</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{story.months}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Support */}
        <div className="card" style={{ marginBottom: '20px', background: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div className="card-body" style={{ flexDirection: 'row', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={32} color="var(--danger)" />
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h3 style={{ textAlign: 'left', color: 'var(--danger)', fontSize: '1.15rem', marginBottom: '8px', fontWeight: 700 }}>
                In Crisis? You're Not Alone.
              </h3>
              <p style={{ color: 'var(--danger)', opacity: 0.8, fontSize: '0.95rem', marginBottom: 0, lineHeight: 1.6 }}>
                If you're experiencing a mental health crisis, reach out immediately. Help is available 24/7.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="tel:1800111565" className="btn-primary btn-sm" style={{ background: 'var(--danger)', borderColor: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} /> iCall: 1800-111-565
              </a>
              <a href="tel:112" className="btn-outline btn-sm" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={14} /> Emergency 112
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default Wellness;
