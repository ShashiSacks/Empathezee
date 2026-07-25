import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Button, PageHeader } from '../components/ui';

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
    <main style={{ flex: 1 }}>
      <PageHeader
        badge={<><i className="fa-solid fa-user-doctor"></i> Doctor Pro Portal</>}
        title="Welcome, Dr."
        highlight={user?.username || 'Specialist'}
        subtitle="Manage medical verification requests and schedule consultations with patients."
        gradient="accent"
      />

      <Container size="xl">
        {/* Tab Selectors */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
          <Button
            onClick={() => setActiveTab('posts')}
            variant={activeTab === 'posts' ? 'primary' : 'outline'}
            size="md"
            icon={<i className="fa-solid fa-clipboard-check"></i>}
          >
            Verification Queue ({posts.length})
          </Button>
          <Button
            onClick={() => setActiveTab('apps')}
            variant={activeTab === 'apps' ? 'primary' : 'outline'}
            size="md"
            icon={<i className="fa-solid fa-calendar-days"></i>}
          >
            Appointments Hub ({appointments.length})
          </Button>
        </div>

        {/* Posts Moderation Tab */}
        {activeTab === 'posts' && (
          <div>
            <h2 style={{ textAlign: 'left', fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--text)' }}>
              📋 Pending Verification Queue
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-6)' }}>
              Review medical queries and advice to tag them as Safe, Misleading/Fake, or Suspicious.
            </p>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                <div className="spinner"></div>
              </div>
            ) : posts.length === 0 ? (
              <Card padding="lg" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>✅</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 var(--space-2)' }}>Inbox Zero!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  No medical posts are currently pending review. Thank you for keeping the community safe!
                </p>
              </Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {posts.map((post) => (
                  <Card key={post._id} padding="lg">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary)', textAlign: 'left' }}>{post.title}</h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                          Author: {post.author?.username || 'Patient'} | Community: {post.community?.name || 'General'}
                        </p>
                      </div>
                      <span className="badge badge-yellow">Pending Review</span>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 'var(--space-5)' }}>
                      {post.content}
                    </p>

                    <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                      <Button onClick={() => handleReview(post._id, 'SAFE', 'Medically verified')} variant="secondary" size="sm" icon={<i className="fa-solid fa-check"></i>}>
                        Tag Safe
                      </Button>
                      <Button onClick={() => handleReview(post._id, 'FAKE', 'Misleading content')} variant="danger" size="sm" icon={<i className="fa-solid fa-triangle-exclamation"></i>}>
                        Tag Misleading
                      </Button>
                      <Button onClick={() => handleReview(post._id, 'SUSPICIOUS', 'Requires warning')} variant="warning" size="sm" icon={<i className="fa-solid fa-flag"></i>}>
                        Tag Suspicious
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
          <div>
            <h2 style={{ textAlign: 'left', fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--text)' }}>
              📅 Patient Consultation Requests
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-6)' }}>
              Accept or reject incoming appointment requests from patients.
            </p>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                <div className="spinner"></div>
              </div>
            ) : appointments.length === 0 ? (
              <Card padding="lg" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>📅</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 var(--space-2)' }}>No Requests</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  You have no pending appointment requests at this time.
                </p>
              </Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {appointments.map((app) => (
                  <Card key={app._id} padding="lg">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)', textAlign: 'left' }}>
                          Patient: {app.user?.username || 'Anonymous Patient'}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                          🗓️ <b>Date:</b> {app.date} | 🕒 <b>Time:</b> {app.time}
                        </p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                          ✉️ <b>Email:</b> {app.user?.email}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                        {app.status === 'PENDING' ? (
                          <>
                            <Button onClick={() => handleAccept(app._id)} variant="secondary" size="sm" icon={<i className="fa-solid fa-check"></i>}>
                              Accept
                            </Button>
                            <Button onClick={() => handleReject(app._id)} variant="danger" size="sm" icon={<i className="fa-solid fa-xmark"></i>}>
                              Reject
                            </Button>
                          </>
                        ) : (
                          <span className={`badge status-${app.status?.toLowerCase()}`}>{app.status}</span>
                        )}

                        {app.status === 'CONFIRMED' && (
                          <Link to={`/chat/appointment/${app._id}`} style={{ textDecoration: 'none' }}>
                            <Button variant="primary" size="sm" icon={<i className="fa-solid fa-comments"></i>}>
                              Start Chat
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
