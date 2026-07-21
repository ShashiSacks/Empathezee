import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

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
    <main className="page-container">
      <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
        <h1 className="title">Doctor Workspace</h1>
        <h2>Welcome, Dr. {user?.username} 🩺</h2>
        <p className="section-desc">Manage medical verification requests and schedule consultations with patients.</p>
      </div>

      {/* tab selectors */}
      <div className="tabs-container" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        <button
          id="tab-posts-btn"
          className={`tab-btn ${activeTab === 'posts' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          📋 Post Verification Queue ({posts.length})
        </button>
        <button
          id="tab-apps-btn"
          className={`tab-btn ${activeTab === 'apps' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('apps')}
        >
          📅 Appointments Hub ({appointments.length})
        </button>
      </div>

      {/* posts moderation tab */}
      {activeTab === 'posts' && (
        <div id="posts-tab" className="tab-content active-content">
          <h2>📋 Pending Verification Queue</h2>
          <p className="section-desc" style={{ marginBottom: '25px' }}>
            Review medical queries and advice to tag them as Safe, Misleading/Fake, or Suspicious.
          </p>

          {posts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✅</span>
              <h3>Inbox Zero!</h3>
              <p>No medical posts are currently pending review. Thank you for keeping the community safe!</p>
            </div>
          ) : (
            <div className="moderation-list">
              {posts.map((post) => (
                <div key={post._id} className="card moderation-card" style={{ textAlign: 'left', alignItems: 'stretch', marginBottom: '20px' }}>
                  <div className="post-details">
                    <h3 style={{ textAlign: 'left' }}>{post.title}</h3>
                    <p className="post-content" style={{ color: 'var(--text)', fontStyle: 'italic', marginTop: '10px', marginBottom: '15px', padding: '12px', background: 'rgba(0, 0, 0, 0.02)', borderLeft: '3px solid var(--blue)', borderRadius: '4px' }}>
                      "{post.content}"
                    </p>
                    <p className="post-meta" style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                      <b>Author:</b> {post.author?.username || 'Anonymous'} &nbsp;|&nbsp;
                      <b>Target Disease:</b> <span style={{ background: 'rgba(79, 70, 229, 0.05)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>{post.disease}</span>
                    </p>
                  </div>

                  {/* verify actions */}
                  <div className="moderation-form" style={{ marginTop: '10px' }}>
                    <div className="moderation-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button onClick={() => handleReview(post._id, 'SAFE', '')} className="btn-success" style={{ flex: 1, minWidth: '140px', padding: '8px 16px', fontSize: '0.88rem' }}>
                        ✔ Approve (Safe)
                      </button>
                      <button onClick={() => handleReview(post._id, 'FAKE', '')} className="btn-danger" style={{ flex: 1, minWidth: '140px', padding: '8px 16px', fontSize: '0.88rem' }}>
                        ❌ Reject (Fake)
                      </button>
                      <button onClick={() => handleReview(post._id, 'SUSPICIOUS', '')} className="btn-warning" style={{ flex: 1, minWidth: '140px', padding: '8px 16px', fontSize: '0.88rem' }}>
                        ⚠ Tag Suspicious
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* appointments tab */}
      {activeTab === 'apps' && (
        <div id="apps-tab" className="tab-content active-content">
          <h2>📅 Booked Consultations</h2>
          <p className="section-desc" style={{ marginBottom: '25px' }}>
            Accept new requests, manage schedule, and launch Telehealth chat sessions with your patients.
          </p>

          {appointments.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📅</span>
              <h3>No Appointments</h3>
              <p>You do not have any patient appointments booked with you yet.</p>
            </div>
          ) : (
            <div className="appointment-grid">
              {appointments.map((app) => (
                <div key={app._id} className="card appointment-card" style={{ textAlign: 'left', alignItems: 'stretch' }}>
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className={`badge status-${app.status?.toLowerCase()}`}>{app.status}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Booked {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 style={{ textAlign: 'left', fontSize: '1.2rem', marginBottom: '10px' }}>Patient: {app.patient?.username || 'Anonymous User'}</h3>
                  <p className="app-detail" style={{ textAlign: 'left', marginBottom: '8px', fontSize: '0.92rem' }}><b>Email:</b> {app.patient?.email}</p>
                  <p className="app-detail" style={{ textAlign: 'left', marginBottom: '8px', fontSize: '0.92rem' }}><b>Date:</b> {app.date}</p>
                  <p className="app-detail" style={{ textAlign: 'left', marginBottom: '15px', fontSize: '0.92rem' }}><b>Time Slot:</b> {app.time}</p>

                  <div className="appointment-card-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                    {app.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                        <button onClick={() => handleAccept(app._id)} className="btn-success" style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}>Accept</button>
                        <button onClick={() => handleReject(app._id)} className="btn-danger-outline" style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}>Reject</button>
                      </div>
                    ) : app.status === 'CONFIRMED' ? (
                      <>
                        <Link to={`/chat/appointment/${app._id}`} className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', width: '100%', padding: '8px 12px', fontSize: '0.85rem', fontWeight: 700 }}>💬 Join Telehealth Chat</Link>
                        <button onClick={() => handleReject(app._id)} className="btn-danger-outline" style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem' }}>Cancel Appointment</button>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
