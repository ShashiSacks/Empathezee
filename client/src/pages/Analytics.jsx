import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Container, Card, PageHeader } from '../components/ui';

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
    <main style={{ flex: 1 }}>
      <PageHeader
        badge={<><i className="fa-solid fa-chart-line"></i> Platform Transparency</>}
        title="Platform Security &"
        highlight="Health Analytics"
        subtitle="Real-time transparency statistics on doctor verifications, community engagement, and disease safety distributions."
        gradient="primary"
      />

      <Container size="xl">
        {/* General Summary Widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
          <Card padding="md" style={{ textAlign: 'center', borderLeft: '4px solid var(--primary)' }}>
            <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: 'var(--space-1)' }}>💬</span>
            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Total Discussions</h3>
            <p style={{ fontSize: '2.2rem', fontWeight: 850, color: 'var(--text)', margin: 0 }}>{totalPosts}</p>
          </Card>

          <Card padding="md" style={{ textAlign: 'center', borderLeft: '4px solid var(--secondary)' }}>
            <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: 'var(--space-1)' }}>🩺</span>
            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Doctor Reviews</h3>
            <p style={{ fontSize: '2.2rem', fontWeight: 850, color: 'var(--secondary)', margin: 0 }}>{doctorVerified + doctorRejected}</p>
          </Card>

          <Card padding="md" style={{ textAlign: 'center', borderLeft: '4px solid var(--danger)' }}>
            <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: 'var(--space-1)' }}>🛡️</span>
            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Fake Post Filters</h3>
            <p style={{ fontSize: '2.2rem', fontWeight: 850, color: 'var(--danger)', margin: 0 }}>{fakePosts}</p>
          </Card>

          <Card padding="md" style={{ textAlign: 'center', borderLeft: '4px solid var(--warning)' }}>
            <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: 'var(--space-1)' }}>👥</span>
            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Active Members</h3>
            <p style={{ fontSize: '2.2rem', fontWeight: 850, color: 'var(--text)', margin: 0 }}>{totalUsers}</p>
          </Card>
        </div>

        {/* Audit Table */}
        <Card padding="lg" style={{ marginBottom: 'var(--space-8)' }}>
          <h3 style={{ textAlign: 'left', marginBottom: 'var(--space-4)', fontSize: '1.15rem', fontWeight: 700 }}>
            📊 Detailed Safety Audit Records
          </h3>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text)', fontWeight: 700 }}>
                  <th style={{ padding: 'var(--space-3) var(--space-3)' }}>Metric</th>
                  <th style={{ padding: 'var(--space-3) var(--space-3)' }}>Count</th>
                  <th style={{ padding: 'var(--space-3) var(--space-3)' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: 'var(--space-3) var(--space-3)' }}>🟢 Safe Content</td>
                  <td style={{ padding: 'var(--space-3) var(--space-3)', fontWeight: 700 }}>{safePosts}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-3)', color: 'var(--text-secondary)' }}>Verified medical information</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: 'var(--space-3) var(--space-3)' }}>🔴 Fake Content</td>
                  <td style={{ padding: 'var(--space-3) var(--space-3)', fontWeight: 700 }}>{fakePosts}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-3)', color: 'var(--text-secondary)' }}>Flagged as misleading by doctors</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: 'var(--space-3) var(--space-3)' }}>🟡 Suspicious Content</td>
                  <td style={{ padding: 'var(--space-3) var(--space-3)', fontWeight: 700 }}>{suspiciousPosts}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-3)', color: 'var(--text-secondary)' }}>Under community review</td>
                </tr>
                <tr>
                  <td style={{ padding: 'var(--space-3) var(--space-3)' }}>⏳ Pending Review</td>
                  <td style={{ padding: 'var(--space-3) var(--space-3)', fontWeight: 700 }}>{pendingPosts}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-3)', color: 'var(--text-secondary)' }}>Awaiting specialist feedback</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </Container>
    </main>
  );
}
