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
        api.get('/api/doctor-posts/pending').catch(() => ({ data: { posts: [] } })),
        api.get('/api/doctor-dashboard/appointments').catch(() => ({ data: [] })),
      ]);

      // Safely extract posts array
      const rawPosts = postsRes.data?.posts || (Array.isArray(postsRes.data) ? postsRes.data : []);
      setPosts(rawPosts);

      const rawAppts = Array.isArray(apptsRes.data) ? apptsRes.data : [];
      setAppointments(rawAppts);
    } catch (err) {
      console.error('Fetch Doctor Dashboard Error:', err);
      setPosts([]);
      setAppointments([]);
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

  const docName = user?.username?.startsWith('Dr.') ? user.username : `Dr. ${user?.username || 'Specialist'}`;

  return (
    <main style={{ flex: 1 }}>
      <PageHeader
        badge={<><i className="fa-solid fa-user-doctor"></i> Doctor Pro Portal</>}
        title="Welcome,"
        highlight={docName}
        subtitle="Manage medical verification requests, track practice availability, and schedule consultations with patients."
        gradient="accent"
      />

      <Container size="xl">
        {/* Doctor Practice Quick Profile Summary Header */}
        <Card padding="lg" style={{ marginBottom: 'var(--space-8)', background: 'linear-gradient(135deg, rgba(79,70,229,0.05) 0%, rgba(16,185,129,0.05) 100%)', border: '1px solid rgba(79,70,229,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800 }}>
                🩺
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>{docName}</h2>
                  <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <i className="fa-solid fa-circle-check"></i> Verified Specialist
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>
                  {user?.specialization || user?.disease || 'General Medicine'} {user?.qualifications ? `• ${user.qualifications}` : ''}
                </p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span>📍 <b>Clinic:</b> {user?.clinicName || user?.city || 'Practice Location Not Set'}</span>
                  <span>💰 <b>Fee:</b> ₹{user?.consultationFee || 500}</span>
                  <span>🕒 <b>Hours:</b> {user?.availableHours || '09:00 AM - 05:00 PM'}</span>
                </div>
              </div>
            </div>

            <div>
              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <Button variant="primary" icon={<i className="fa-solid fa-user-pen"></i>}>
                  Edit Practice Profile
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Tab Selectors */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
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
          <Button
            onClick={() => setActiveTab('profile')}
            variant={activeTab === 'profile' ? 'primary' : 'outline'}
            size="md"
            icon={<i className="fa-solid fa-id-card"></i>}
          >
            My Doctor Profile
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
                <div className="spinner" style={{ margin: '0 auto' }}></div>
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
                <div className="spinner" style={{ margin: '0 auto' }}></div>
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
                          Patient: {app.patient?.username || app.user?.username || 'Anonymous Patient'}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                          🗓️ <b>Date:</b> {app.date} | 🕒 <b>Time:</b> {app.time}
                        </p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                          ✉️ <b>Email:</b> {app.patient?.email || app.user?.email}
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

        {/* Doctor Profile Quick Management Tab */}
        {activeTab === 'profile' && (
          <div>
            <h2 style={{ textAlign: 'left', fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--text)' }}>
              🩺 Medical Practice & Profile Details
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-6)' }}>
              Review your public credentials, clinical experience, operating hours, and consultation pricing.
            </p>

            <Card padding="lg" style={{ textAlign: 'left' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--primary)' }}>Doctor Details</h3>
                  <p style={{ margin: '0 0 8px', fontSize: '0.92rem' }}><b>Full Name:</b> {docName}</p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.92rem' }}><b>Email:</b> {user?.email}</p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.92rem' }}><b>Specialization:</b> {user?.specialization || user?.disease || 'Not specified'}</p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.92rem' }}><b>Qualifications:</b> {user?.qualifications || 'MBBS / Specialist'}</p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.92rem' }}><b>Clinical Experience:</b> {user?.experienceYears ? `${user.experienceYears} Years` : 'Not specified'}</p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.92rem' }}><b>License / Reg No:</b> {user?.licenseNumber || 'Verified Medical License'}</p>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--primary)' }}>Clinic & Booking Settings</h3>
                  <p style={{ margin: '0 0 8px', fontSize: '0.92rem' }}><b>Clinic / Hospital:</b> {user?.clinicName || 'Empathezee Telehealth Clinic'}</p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.92rem' }}><b>Address:</b> {user?.clinicAddress || user?.city || 'Not specified'}</p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.92rem' }}><b>Consultation Fee:</b> ₹{user?.consultationFee || 500}</p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.92rem' }}><b>Available Days:</b> {user?.availableDays || 'Mon - Sat'}</p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.92rem' }}><b>Operating Hours:</b> {user?.availableHours || '09:00 AM - 05:00 PM'}</p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.92rem' }}><b>Contact Phone:</b> {user?.phone || 'Not provided'}</p>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)', display: 'flex', gap: 'var(--space-3)' }}>
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" icon={<i className="fa-solid fa-pen-to-square"></i>}>
                    Edit Full Profile & Schedule
                  </Button>
                </Link>
                <Link to="/doctor/search" style={{ textDecoration: 'none' }}>
                  <Button variant="outline" icon={<i className="fa-solid fa-eye"></i>}>
                    View Public Search Listing
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </Container>
    </main>
  );
}
