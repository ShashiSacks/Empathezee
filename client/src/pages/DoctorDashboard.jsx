import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, ClipboardList, Calendar, CheckCircle, XCircle, AlertTriangle, User, Clock, Video } from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'apps'
  const [posts, setPosts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [postsRes, appsRes] = await Promise.all([
        axios.get('/api/doctor-posts/pending'),
        axios.get('/api/doctor-dashboard/appointments')
      ]);
      
      setPosts(postsRes.data.posts || []);
      setAppointments(appsRes.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewPost = async (e, postId, status) => {
    e.preventDefault();
    const comment = e.target.elements.comment?.value || '';
    
    try {
      const payload = new URLSearchParams();
      payload.append('status', status);
      payload.append('comment', comment);
      
      await axios.post(`/api/doctor-posts/review/${postId}`, payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      // Remove from list after success
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      alert('Failed to review post. Please try again.');
    }
  };

  const handleApptAction = async (e, appId, action) => {
    e.preventDefault();
    if (action === 'reject' && !window.confirm('Are you sure you want to cancel this consultation?')) {
      return;
    }
    
    try {
      await axios.post(`/api/doctor-dashboard/${action}/${appId}`);
      // Refresh list to get updated status
      fetchDashboardData();
    } catch (err) {
      alert(`Failed to ${action} appointment.`);
    }
  };

  if (loading) {
    return (
      <main className="page-container" style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px', borderTopColor: 'var(--primary)' }}></div>
      </main>
    );
  }

  return (
    <main className="page-container" style={{ paddingTop: '40px', paddingBottom: '64px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ width: '64px', height: '64px', background: 'var(--primary-50)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Stethoscope size={32} />
        </div>
        <h1 className="title" style={{ fontSize: '2rem', marginBottom: '8px' }}>Doctor Workspace</h1>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text)', fontWeight: 600 }}>Welcome, Dr. {user?.username}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '12px' }}>Manage medical verification requests and schedule consultations with patients.</p>
      </div>

      {error && <div className="error-message" style={{ color: 'var(--danger)', background: 'var(--danger-bg)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center', marginBottom: '24px' }}>{error}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
        <button 
          onClick={() => setActiveTab('posts')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: activeTab === 'posts' ? 'var(--primary)' : 'transparent', 
            color: activeTab === 'posts' ? 'white' : 'var(--text-secondary)', 
            border: activeTab === 'posts' ? '1px solid var(--primary)' : '1px solid var(--border)', 
            padding: '12px 24px', 
            fontWeight: 600, 
            borderRadius: '12px', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <ClipboardList size={18} /> Verification Queue <span style={{ background: activeTab === 'posts' ? 'rgba(255,255,255,0.2)' : 'var(--bg-warm)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{posts.length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('apps')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: activeTab === 'apps' ? 'var(--primary)' : 'transparent', 
            color: activeTab === 'apps' ? 'white' : 'var(--text-secondary)', 
            border: activeTab === 'apps' ? '1px solid var(--primary)' : '1px solid var(--border)', 
            padding: '12px 24px', 
            fontWeight: 600, 
            borderRadius: '12px', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Calendar size={18} /> Appointments Hub <span style={{ background: activeTab === 'apps' ? 'rgba(255,255,255,0.2)' : 'var(--bg-warm)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{appointments.length}</span>
        </button>
      </div>

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--primary-50)', color: 'var(--primary)', padding: '10px', borderRadius: '10px' }}>
              <ClipboardList size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Pending Verification Queue</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Review medical queries and advice to tag them as Safe, Misleading/Fake, or Suspicious.</p>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="card" style={{ padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ color: 'var(--success)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <CheckCircle size={48} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Inbox Zero!</h3>
              <p style={{ color: 'var(--text-secondary)' }}>No medical posts are currently pending review. Thank you for keeping the community safe!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {posts.map(post => (
                <div key={post._id} className="card" style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '1.25rem' }}>{post.title}</h3>
                    <p style={{ color: 'var(--text)', fontStyle: 'italic', margin: '0 0 16px', padding: '16px', background: 'var(--bg-warm)', borderLeft: '4px solid var(--primary)', borderRadius: '0 8px 8px 0', lineHeight: 1.6 }}>
                      "{post.content}"
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <User size={14} /> <b>Author:</b> {post.author?.username || 'Anonymous'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <Stethoscope size={14} /> <b>Target Disease:</b> <span style={{ background: 'var(--primary-50)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>{post.disease}</span>
                      </span>
                    </div>
                  </div>
                  
                  <form onSubmit={(e) => e.preventDefault()} style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label htmlFor={`comment-${post._id}`}>Verification Note (Optional)</label>
                      <input type="text" name="comment" id={`comment-${post._id}`} placeholder="Add professional verification notes..." />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button onClick={(e) => handleReviewPost(e, post._id, 'SAFE')} className="btn-success" style={{ flex: 1, minWidth: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}>
                        <CheckCircle size={18} /> Approve (Safe)
                      </button>
                      <button onClick={(e) => handleReviewPost(e, post._id, 'FAKE')} className="btn-danger" style={{ flex: 1, minWidth: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}>
                        <XCircle size={18} /> Reject (Fake)
                      </button>
                      <button onClick={(e) => handleReviewPost(e, post._id, 'SUSPICIOUS')} className="btn-warning" style={{ flex: 1, minWidth: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}>
                        <AlertTriangle size={18} /> Tag Suspicious
                      </button>
                    </div>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'apps' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--primary-50)', color: 'var(--primary)', padding: '10px', borderRadius: '10px' }}>
              <Calendar size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Booked Consultations</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Accept new requests, manage schedule, and launch Telehealth chat sessions with your patients.</p>
            </div>
          </div>

          {appointments.length === 0 ? (
            <div className="card" style={{ padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <Calendar size={48} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>No Appointments</h3>
              <p style={{ color: 'var(--text-secondary)' }}>You do not have any patient appointments booked with you yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {appointments.map(app => (
                <div key={app._id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <span className={`badge badge-${app.status === 'CONFIRMED' ? 'green' : app.status === 'CANCELLED' ? 'red' : 'orange'}`}>
                      {app.status}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Booked {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                      <User size={24} />
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem' }}>{app.patient?.username || 'Anonymous User'}</h3>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{app.patient?.email}</p>
                    </div>
                  </div>

                  <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <Calendar size={16} /> <b>Date:</b> <span style={{ color: 'var(--text)' }}>{app.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <Clock size={16} /> <b>Time Slot:</b> <span style={{ color: 'var(--text)' }}>{app.time}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                    {app.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                        <button onClick={(e) => handleApptAction(e, app._id, 'accept')} className="btn-success" style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <CheckCircle size={18} /> Accept
                        </button>
                        <button onClick={(e) => handleApptAction(e, app._id, 'reject')} className="btn-danger-outline" style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <XCircle size={18} /> Reject
                        </button>
                      </div>
                    ) : app.status === 'CONFIRMED' ? (
                      <>
                        <Link to={`/chat/appointment/${app._id}`} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}>
                          <Video size={18} /> Join Telehealth Chat
                        </Link>
                        <button onClick={(e) => handleApptAction(e, app._id, 'reject')} className="btn-danger-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}>
                          <XCircle size={18} /> Cancel Appointment
                        </button>
                      </>
                    ) : (
                      <div style={{ background: 'var(--bg-warm)', padding: '12px', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        Consultation Cancelled / Closed
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default DoctorDashboard;
