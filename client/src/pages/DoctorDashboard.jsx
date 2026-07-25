import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Button, Badge } from '../components/ui';
import {
  Stethoscope,
  Calendar,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Flag,
  MessageSquare,
  Clock,
  User,
  ShieldCheck,
  XCircle,
  Loader2
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postsRes, apptsRes] = await Promise.all([
        api.get('/api/doctor-posts/pending').catch(() => ({ data: [] })),
        api.get('/api/doctor-dashboard/appointments').catch(() => ({ data: [] })),
      ]);
      setPosts(postsRes.data || []);
      setAppointments(apptsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReview = async (postId, status, comment) => {
    try {
      await api.post(`/api/doctor-posts/review/${postId}`, { status, comment });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (appId) => {
    try {
      await api.post(`/api/doctor-dashboard/accept/${appId}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (appId) => {
    try {
      await api.post(`/api/doctor-dashboard/reject/${appId}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main style={{ flex: 1, paddingBottom: 'var(--space-12)' }}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-10 px-6 border-b border-indigo-900/30">
        <Container size="xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-500/30 mb-3">
                <Stethoscope className="w-3.5 h-3.5" /> Clinical Provider Portal
              </span>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                Welcome, <span className="text-indigo-300">Dr. {user?.username || 'Specialist'}</span>
              </h1>
              <p className="text-slate-400 text-sm">
                Manage medical verification queues and patient consultation schedules.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Clinical Partner
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container size="xl" className="pt-8">
        {/* Tab Selectors */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'posts'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" /> Verification Queue ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('apps')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'apps'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" /> Patient Appointments ({appointments.length})
          </button>
        </div>

        {/* Posts Moderation Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-indigo-600" /> Pending Medical Verification Queue
              </h2>
              <p className="text-sm text-slate-500">
                Review community posts to verify medical advice as Safe, Misleading, or Suspicious.
              </p>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
                <p className="text-sm font-medium">Loading verification queue...</p>
              </div>
            ) : posts.length === 0 ? (
              <Card padding="lg" className="text-center py-12 border border-slate-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">Queue Clear!</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  No patient queries are currently pending medical review. Thank you for keeping the community safe!
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post._id} padding="lg" className="border border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{post.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <span>Author: <strong>{post.author?.username || 'Patient'}</strong></span>
                          <span>•</span>
                          <span>Community: <strong>{post.community?.name || 'General'}</strong></span>
                        </p>
                      </div>
                      <Badge variant="warning" size="sm">Pending Verification</Badge>
                    </div>

                    <p className="text-slate-700 text-sm leading-relaxed mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-3 flex-wrap pt-1">
                      <Button
                        onClick={() => handleReview(post._id, 'SAFE', 'Medically verified')}
                        variant="secondary"
                        size="sm"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" /> Tag Safe
                      </Button>
                      <Button
                        onClick={() => handleReview(post._id, 'FAKE', 'Misleading content')}
                        variant="danger"
                        size="sm"
                      >
                        <AlertTriangle className="w-4 h-4 mr-1.5" /> Tag Misleading
                      </Button>
                      <Button
                        onClick={() => handleReview(post._id, 'SUSPICIOUS', 'Requires warning')}
                        variant="outline"
                        size="sm"
                      >
                        <Flag className="w-4 h-4 mr-1.5 text-amber-500" /> Tag Suspicious
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'apps' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" /> Consultation Schedule
              </h2>
              <p className="text-sm text-slate-500">
                Review and accept incoming appointment requests from patients.
              </p>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
                <p className="text-sm font-medium">Loading appointment requests...</p>
              </div>
            ) : appointments.length === 0 ? (
              <Card padding="lg" className="text-center py-12 border border-slate-200">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">No Pending Requests</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  You currently have no new appointment requests from patients.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {appointments.map((app) => (
                  <Card key={app._id} padding="lg" className="border border-slate-200 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <h3 className="text-base font-bold text-slate-900">
                            Patient: {app.user?.username || 'Anonymous Patient'}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-indigo-600" /> <strong>{app.date}</strong> at {app.time}
                          </span>
                          <span>•</span>
                          <span>Email: {app.user?.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {app.status === 'PENDING' ? (
                          <>
                            <Button onClick={() => handleAccept(app._id)} variant="secondary" size="sm">
                              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Accept
                            </Button>
                            <Button onClick={() => handleReject(app._id)} variant="danger" size="sm">
                              <XCircle className="w-4 h-4 mr-1.5" /> Reject
                            </Button>
                          </>
                        ) : (
                          <Badge variant={app.status === 'CONFIRMED' ? 'success' : 'neutral'} size="sm">
                            {app.status}
                          </Badge>
                        )}

                        {app.status === 'CONFIRMED' && (
                          <Link to={`/chat/appointment/${app._id}`}>
                            <Button variant="primary" size="sm">
                              <MessageSquare className="w-4 h-4 mr-1.5" /> Start Chat
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </main>
  );
}
