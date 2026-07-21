import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    safePosts: 0,
    fakePosts: 0,
    pendingPosts: 0,
    suspiciousPosts: 0,
    doctorVerified: 0,
    doctorRejected: 0,
    diseaseStats: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/api/analytics');
        setStats(res.data || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  const { totalPosts, totalUsers, safePosts, fakePosts, pendingPosts, suspiciousPosts, doctorVerified, doctorRejected, diseaseStats } = stats;

  return (
    <main className="page-container">
      <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
        <h1 className="title">Platform Security & Health Analytics</h1>
        <p className="section-desc">Real-time transparency statistics on doctor verifications, community engagement, and disease safety distributions.</p>
      </div>

      {/* general summary widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ padding: '20px', textAlign: 'center', borderLeft: '4px solid var(--blue)' }}>
          <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '5px' }}>💬</span>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Total Discussions</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 850, color: 'var(--text)', margin: 0 }}>{totalPosts}</p>
        </div>

        <div className="card" style={{ padding: '20px', textAlign: 'center', borderLeft: '4px solid var(--success)' }}>
          <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '5px' }}>🩺</span>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Doctor Reviews</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 850, color: 'var(--success)', margin: 0 }}>{doctorVerified + doctorRejected}</p>
        </div>

        <div className="card" style={{ padding: '20px', textAlign: 'center', borderLeft: '4px solid var(--danger)' }}>
          <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '5px' }}>🛡️</span>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Fake Post Filters</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 850, color: 'var(--danger)', margin: 0 }}>{fakePosts}</p>
        </div>

        <div className="card" style={{ padding: '20px', textAlign: 'center', borderLeft: '4px solid var(--warning)' }}>
          <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '5px' }}>👥</span>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Active Members</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 850, color: 'var(--text)', margin: 0 }}>{totalUsers}</p>
        </div>
      </div>

      {/* Audit table */}
      <div className="card" style={{ padding: '30px', textAlign: 'left', marginBottom: '40px' }}>
        <h3 style={{ textAlign: 'left', marginBottom: '15px' }}>📊 Detailed Safety Audit Records</h3>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--line)', color: 'var(--text)', fontWeight: 700 }}>
                <th style={{ padding: '12px 10px' }}>Metric</th>
                <th style={{ padding: '12px 10px' }}>Count</th>
                <th style={{ padding: '12px 10px' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '12px 10px' }}>🟢 Safe Content</td>
                <td style={{ padding: '12px 10px', fontWeight: 700 }}>{safePosts}</td>
                <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>Verified medical information</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '12px 10px' }}>🔴 Fake Content</td>
                <td style={{ padding: '12px 10px', fontWeight: 700 }}>{fakePosts}</td>
                <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>Flagged as misleading by doctors</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '12px 10px' }}>🟡 Suspicious Content</td>
                <td style={{ padding: '12px 10px', fontWeight: 700 }}>{suspiciousPosts}</td>
                <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>Requires further review</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 10px' }}>⚪ Pending Review</td>
                <td style={{ padding: '12px 10px', fontWeight: 700 }}>{pendingPosts}</td>
                <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>Currently in doctor moderation queue</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
