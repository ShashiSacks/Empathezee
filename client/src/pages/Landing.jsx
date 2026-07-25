import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Card, Badge } from '../components/ui';
import {
  HeartHandshake,
  Users,
  UserCheck,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Pill,
  Brain,
  PhoneCall,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function Landing() {
  return (
    <main style={{ minHeight: '80vh', paddingBottom: 'var(--space-12)' }}>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white py-16 md:py-24 relative overflow-hidden border-b border-indigo-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        
        <Container size="xl" className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md mb-6 border border-white/10">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>Empathetic Digital Healthcare & Peer Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            You don't have to fight your illness <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-teal-300">alone.</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Connect with disease-specific peer communities, consult verified medical specialists, manage prescriptions, and access mental wellness tools in one safe, compassionate platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 max-w-lg mx-auto">
            <Link to="/register">
              <Button variant="primary" size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-lg px-8">
                <UserPlus className="w-5 h-5 mr-2" /> Join Empathezee Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10 px-8">
                <LogIn className="w-5 h-5 mr-2" /> Member Login
              </Button>
            </Link>
            <Link to="/doctor/login">
              <Button variant="ghost" size="lg" className="text-slate-300 hover:text-white hover:bg-white/10 px-6">
                <Stethoscope className="w-5 h-5 mr-2" /> Doctor Portal
              </Button>
            </Link>
          </div>

          {/* Key Metrics / Trust Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16 pt-10 border-t border-slate-800 text-center">
            <div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Verified Medical Advice</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Peer Support Access</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">HIPAA</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Encrypted & Private</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">1,000+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Verified Specialists</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 md:py-24">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Everything you need in one compassionate platform
            </h2>
            <p className="text-slate-600 text-base">
              Co-designed alongside clinical specialists and patients to provide holistic physical, social, and mental health care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Peer Communities */}
            <Card padding="lg" className="border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Disease-Specific Support</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Join structured communities for specialized conditions, exchange treatment experiences, and connect with peers who truly understand.
                </p>
              </div>
              <Link to="/register">
                <Button variant="outline" size="sm" fullWidth>
                  Explore Communities <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </Card>

            {/* Card 2: Verified Doctors */}
            <Card padding="lg" className="border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 font-bold">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Doctor Consultations</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Locate top clinical specialists nearby by location and medical focus. Book virtual consultations and direct chat sessions seamlessly.
                </p>
              </div>
              <Link to="/register">
                <Button variant="outline" size="sm" fullWidth>
                  Find Specialists <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </Card>

            {/* Card 3: Mental Wellness & Tracking */}
            <Card padding="lg" className="border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 font-bold">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Mental Wellness & Tracking</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Access guided mindfulness exercises, prescription dosage trackers, daily hydration metrics, and emotional health tools.
                </p>
              </div>
              <Link to="/register">
                <Button variant="outline" size="sm" fullWidth>
                  Start Wellness Tools <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </Card>
          </div>
        </Container>
      </section>

      {/* Emergency Assistance Banner */}
      <section className="bg-red-50/60 border-y border-red-100 py-8">
        <Container size="xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider">24/7 Immediate Emergency Help</h4>
                <p className="text-sm font-semibold text-slate-900">Are you experiencing an acute medical emergency? Call national services immediately.</p>
              </div>
            </div>
            <a href="tel:112">
              <Button variant="danger" size="md" className="whitespace-nowrap px-6">
                <PhoneCall className="w-4 h-4 mr-2" /> Call 112 Emergency
              </Button>
            </a>
          </div>
        </Container>
      </section>
    </main>
  );
}
