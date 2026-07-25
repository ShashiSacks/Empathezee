import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Button, Badge } from '../components/ui';
import {
  Calendar,
  Pill,
  Users,
  UserCheck,
  Droplets,
  HeartPulse,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [hydration, setHydration] = useState(4); // 4 out of 8 glasses
  const [meds, setMeds] = useState([
    { id: 1, name: 'Multivitamin Complex', dose: '1 Capsule (Morning)', taken: true },
    { id: 2, name: 'Omega-3 Fish Oil', dose: '1 Softgel (After Lunch)', taken: false },
    { id: 3, name: 'Hydration Electrolytes', dose: '1 Tablet (Evening)', taken: false }
  ]);

  const toggleMed = (id) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <main style={{ flex: 1, paddingBottom: 'var(--space-12)' }}>
      <Container size="xl">
        {/* Welcome Header */}
        <div className="mb-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Patient Wellness Portal
              </span>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {getGreeting()}, <span className="text-indigo-200">{user?.username || 'Patient'}</span> 👋
              </h1>
              <p className="text-indigo-100/80 text-sm leading-relaxed">
                Welcome back to Empathezee. Here is your daily health summary, active support networks, and upcoming care schedule.
              </p>
            </div>
            <div className="flex items-center gap-3 relative z-10 shrink-0">
              <Link to="/doctor/search">
                <Button variant="primary" size="md" className="bg-indigo-500 hover:bg-indigo-400 text-white border-0 shadow-lg">
                  <UserCheck className="w-4 h-4 mr-2" /> Book Doctor
                </Button>
              </Link>
              <Link to="/communities">
                <Button variant="outline" size="md" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Users className="w-4 h-4 mr-2" /> Join Community
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column 1 & 2 */}
          <div className="lg:col-span-2 space-y-6">

            {/* Upcoming Appointment Widget */}
            <Card padding="lg" className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Upcoming Consultation</h3>
                    <p className="text-xs text-slate-500">Confirmed Appointment</p>
                  </div>
                </div>
                <Badge variant="primary" size="sm">Confirmed</Badge>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-semibold text-slate-900">Dr. Sarah Jenkins, MD</div>
                  <div className="text-xs text-slate-500">Cardiology & Internal Medicine • City General Hospital</div>
                  <div className="flex items-center gap-4 pt-1 text-xs font-medium text-slate-600">
                    <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-600" /> Today, 4:30 PM</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Video Call Ready</span>
                  </div>
                </div>
                <Link to="/appointments-ui">
                  <Button variant="primary" size="sm" className="whitespace-nowrap">
                    Join Call <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Today's Prescription & Medication Tracker */}
            <Card padding="lg" className="border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Today's Prescriptions</h3>
                    <p className="text-xs text-slate-500">Daily Dosage Checklist</p>
                  </div>
                </div>
                <Link to="/medicine" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  Catalog <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {meds.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMed(m.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      m.taken
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className={`w-5 h-5 ${m.taken ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'}`} />
                      <div>
                        <div className={`font-semibold text-sm ${m.taken ? 'line-through text-slate-500' : ''}`}>{m.name}</div>
                        <div className="text-xs text-slate-500">{m.dose}</div>
                      </div>
                    </div>
                    <Badge variant={m.taken ? 'success' : 'neutral'} size="sm">
                      {m.taken ? 'Taken' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Platform Feature Directory Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card padding="md" className="border border-slate-200 hover:border-indigo-300 transition-all">
                <Users className="w-8 h-8 text-indigo-600 mb-3" />
                <h4 className="font-bold text-slate-900 text-base mb-1">Peer Support Groups</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Connect with verified disease support groups and share lived experiences safely.</p>
                <Link to="/communities">
                  <Button variant="outline" size="sm" fullWidth>Browse Groups</Button>
                </Link>
              </Card>

              <Card padding="md" className="border border-slate-200 hover:border-blue-300 transition-all">
                <HeartPulse className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-bold text-slate-900 text-base mb-1">Mental Wellness Hub</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Guided meditations, stress trackers, and cognitive wellness exercises.</p>
                <Link to="/wellness">
                  <Button variant="outline" size="sm" fullWidth>Explore Tools</Button>
                </Link>
              </Card>
            </div>

          </div>

          {/* Sidebar Column 3 */}
          <div className="space-y-6">

            {/* Hydration & Daily Wellness Progress Widget */}
            <Card padding="lg" className="border border-slate-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-slate-900">Hydration Tracker</h4>
                </div>
                <span className="text-xs font-bold text-blue-700">{hydration} / 8 Glasses</span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(hydration / 8) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  disabled={hydration >= 8}
                  onClick={() => setHydration(prev => Math.min(8, prev + 1))}
                >
                  + Add Glass
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={hydration <= 0}
                  onClick={() => setHydration(prev => Math.max(0, prev - 1))}
                >
                  Reset
                </Button>
              </div>
            </Card>

            {/* Daily Healthcare Tip */}
            <Card padding="md" className="border border-emerald-200 bg-emerald-50/40">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm mb-1">Daily Wellness Tip</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Taking 10 minutes of mindful deep breathing between clinical work or study lowers cortisol levels and aids cardiovascular health.
                  </p>
                </div>
              </div>
            </Card>

            {/* Safety & Emergency Information */}
            <Card padding="md" className="border border-red-100 bg-red-50/30">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-900 text-sm mb-1">24/7 Medical Emergency</h5>
                  <p className="text-xs text-slate-600 mb-3">
                    If you are experiencing severe symptoms or a medical crisis, call emergency services immediately.
                  </p>
                  <a
                    href="tel:112"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                  >
                    Call 112 Emergency
                  </a>
                </div>
              </div>
            </Card>

            {/* Platform Analytics Quick Link */}
            <Card padding="md" className="border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Health Metrics</h5>
                    <p className="text-xs text-slate-500">View trust & safety data</p>
                  </div>
                </div>
                <Link to="/analytics">
                  <ChevronRight className="w-5 h-5 text-slate-400 hover:text-slate-900" />
                </Link>
              </div>
            </Card>

          </div>

        </div>
      </Container>
    </main>
  );
}
