import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/analytics');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <main className="page-container" style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Loading Analytics...</h2>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="page-container" style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Failed to load analytics data.</h2>
      </main>
    );
  }

  const {
    totalPosts = 0,
    totalUsers = 0,
    safePosts = 0,
    fakePosts = 0,
    pendingPosts = 0,
    suspiciousPosts = 0,
    doctorVerified = 0,
    doctorRejected = 0,
    diseaseStats = []
  } = data;

  const totalReviews = doctorVerified + doctorRejected;

  // Chart configs
  const safetyChartData = {
    labels: ['Safe', 'Fake', 'Suspicious', 'Pending'],
    datasets: [{
      data: [safePosts, fakePosts, suspiciousPosts, pendingPosts],
      backgroundColor: [
        '#0d9488', // success green
        '#e11d48', // danger red
        '#d97706', // warning amber
        '#cbd5e1'  // neutral grey
      ],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  const safetyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    cutout: '65%'
  };

  const diseaseChartData = {
    labels: diseaseStats.map(stat => stat._id || 'Unknown'),
    datasets: [{
      label: 'Discussions Count',
      data: diseaseStats.map(stat => stat.count),
      backgroundColor: 'rgba(79, 70, 229, 0.75)',
      hoverBackgroundColor: 'rgba(79, 70, 229, 0.95)',
      borderRadius: 6,
      borderWidth: 0
    }]
  };

  const diseaseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#e2e8f0' },
        ticks: { precision: 0 }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  const getPercentage = (count) => {
    return totalPosts > 0 ? ((count / totalPosts) * 100).toFixed(1) : '0.0';
  };

  return (
    <main className="page-container">
      <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
        <h1 className="title">Platform Security & Health Analytics</h1>
        <p className="section-desc">Real-time transparency statistics on doctor verifications, community engagement, and disease safety distributions.</p>
      </div>

      {/* General Summary Widgets */}
      <div className="container" style={{ marginBottom: '40px' }}>
        <div className="card" style={{ padding: '20px', textAlign: 'center', borderLeft: '4px solid var(--blue)' }}>
          <div className="card-body">
            <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '5px' }}>💬</span>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Total Discussions</h3>
            <p style={{ fontSize: '2.2rem', fontWeight: 850, color: 'var(--text)', margin: 0, lineHeight: 1 }}>{totalPosts}</p>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', textAlign: 'center', borderLeft: '4px solid var(--success)' }}>
          <div className="card-body">
            <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '5px' }}>🩺</span>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Doctor Reviews</h3>
            <p style={{ fontSize: '2.2rem', fontWeight: 850, color: 'var(--success)', margin: 0, lineHeight: 1 }}>{totalReviews}</p>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', textAlign: 'center', borderLeft: '4px solid var(--danger)' }}>
          <div className="card-body">
            <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '5px' }}>🛡️</span>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Fake Post Filters</h3>
            <p style={{ fontSize: '2.2rem', fontWeight: 850, color: 'var(--danger)', margin: 0, lineHeight: 1 }}>{fakePosts}</p>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', textAlign: 'center', borderLeft: '4px solid var(--warning)' }}>
          <div className="card-body">
            <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '5px' }}>👥</span>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Active Members</h3>
            <p style={{ fontSize: '2.2rem', fontWeight: 850, color: 'var(--text)', margin: 0, lineHeight: 1 }}>{totalUsers}</p>
          </div>
        </div>
      </div>

      {/* Charts Panel */}
      <div className="appointment-layout" style={{ marginBottom: '40px' }}>
        
        {/* Safety Analysis (Chart 1) */}
        <div className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>🛡️ Content Safety Analysis</h3>
          <div style={{ width: '100%', maxWidth: '320px', height: '320px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Doughnut data={safetyChartData} options={safetyChartOptions} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '25px', fontSize: '0.88rem' }}>
            <span>🟢 Safe: <b>{safePosts}</b></span>
            <span>🔴 Fake: <b>{fakePosts}</b></span>
            <span>🟡 Suspicious: <b>{suspiciousPosts}</b></span>
            <span>⚪ Pending: <b>{pendingPosts}</b></span>
          </div>
        </div>

        {/* Disease Distributions (Chart 2) */}
        <div className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>🔥 Most Active Diseases</h3>
          
          {diseaseStats.length === 0 ? (
            <div style={{ margin: 'auto', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No post discussions exist to map disease analytics.
            </div>
          ) : (
            <div style={{ width: '100%', height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Bar data={diseaseChartData} options={diseaseChartOptions} />
            </div>
          )}
        </div>
      </div>

      {/* Data Breakdown Tables */}
      <div className="card" style={{ padding: '30px', textAlign: 'left', alignItems: 'stretch', marginBottom: '40px' }}>
        <h3 style={{ textAlign: 'left', marginBottom: '15px' }}>📊 Detailed Safety Audit Records</h3>
        <p style={{ textAlign: 'left', marginTop: '-10px', marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Summary table listing safety statuses.
        </p>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--line)', color: 'var(--text)', fontWeight: 700 }}>
                <th style={{ padding: '12px 10px' }}>Classification Metric</th>
                <th style={{ padding: '12px 10px' }}>Audit Count</th>
                <th style={{ padding: '12px 10px' }}>Percentage</th>
                <th style={{ padding: '12px 10px' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--success)' }}>🟢 Safe Content</td>
                <td style={{ padding: '12px 10px', fontWeight: 700 }}>{safePosts}</td>
                <td style={{ padding: '12px 10px' }}>{getPercentage(safePosts)}%</td>
                <td style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Approved by medical specialists as safe and verified healthcare advice.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--danger)' }}>🔴 Fake / Misleading Info</td>
                <td style={{ padding: '12px 10px', fontWeight: 700 }}>{fakePosts}</td>
                <td style={{ padding: '12px 10px' }}>{getPercentage(fakePosts)}%</td>
                <td style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Rejected content flagged as fake or dangerous for patients.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--warning)' }}>🟡 Suspicious Advice</td>
                <td style={{ padding: '12px 10px', fontWeight: 700 }}>{suspiciousPosts}</td>
                <td style={{ padding: '12px 10px' }}>{getPercentage(suspiciousPosts)}%</td>
                <td style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Unverified health tips containing potential risks. Care is recommended.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--text-muted)' }}>⚪ Pending Moderation</td>
                <td style={{ padding: '12px 10px', fontWeight: 700 }}>{pendingPosts}</td>
                <td style={{ padding: '12px 10px' }}>{getPercentage(pendingPosts)}%</td>
                <td style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Newly published posts in queue awaiting medical review.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Analytics;
