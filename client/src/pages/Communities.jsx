import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Communities() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [disease, setDisease] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('online');
  const [paymentType, setPaymentType] = useState('free');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingPlace, setMeetingPlace] = useState('');

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/communities');
      setCommunities(res.data.communities || res.data || []);
      if (res.data.userCommunities) {
        setUserCommunities(res.data.userCommunities.map((id) => id.toString()));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleJoin = async (id) => {
    try {
      await api.post(`/api/communities/${id}/join`);
      fetchCommunities();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeave = async (id) => {
    try {
      await api.post(`/api/communities/${id}/leave`);
      fetchCommunities();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/communities', {
        name,
        disease,
        location,
        type,
        paymentType,
        price,
        description,
        meetingDate,
        meetingTime,
        meetingPlace,
      });
      setName('');
      setDisease('');
      setLocation('');
      setDescription('');
      fetchCommunities();
    } catch (err) {
      console.error(err);
    }
  };

  const diseaseColors = {
    default: { bg: 'var(--primary-50)', color: 'var(--primary)', icon: '🏥' },
    diabet: { bg: '#FEF3C7', color: '#D97706', icon: '🩸' },
    cancer: { bg: '#FDF2F8', color: '#9D174D', icon: '🎗️' },
    heart: { bg: '#FFF1F2', color: '#BE123C', icon: '❤️' },
    kidney: { bg: '#F0FDF4', color: '#166534', icon: '🫘' },
    pcos: { bg: '#FDF4FF', color: '#7E22CE', icon: '🌸' },
    thyroid: { bg: '#FFFBEB', color: '#92400E', icon: '🦋' },
    asthma: { bg: '#EFF6FF', color: '#1D4ED8', icon: '💨' },
    mental: { bg: '#F5F3FF', color: '#5B21B6', icon: '🧠' },
    arthrit: { bg: '#FFF7ED', color: '#C2410C', icon: '🦴' },
    ms: { bg: '#F0F9FF', color: '#0369A1', icon: '🔵' },
  };

  const getDc = (diseaseName) => {
    const diseaseKey = diseaseName.toLowerCase();
    for (const key of Object.keys(diseaseColors)) {
      if (diseaseKey.includes(key)) return diseaseColors[key];
    }
    return diseaseColors.default;
  };

  const filteredCommunities = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'online') return c.type === 'online';
    if (activeFilter === 'free') return c.paymentType === 'free';
    return c.disease.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <main>
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(145deg, var(--primary-50) 0%, var(--accent-50) 50%, var(--secondary-50) 100%)',
          padding: '64px 24px 48px',
          textAlign: 'center',
          borderBottom: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', background: 'radial-gradient(circle,rgba(37,99,235,0.08),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-60px', left: '-20px', width: '200px', height: '200px', background: 'radial-gradient(circle,rgba(20,184,166,0.07),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: 'rgba(37,99,235,0.08)',
              border: '1px solid rgba(37,99,235,0.16)',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--primary)',
              marginBottom: '20px',
            }}
          >
            <i className="fa-solid fa-heart-pulse" aria-hidden="true"></i> Healthcare Community Platform
          </div>

          <h1 className="title" style={{ fontSize: 'clamp(2rem,4vw,2.75rem)', marginBottom: '12px' }}>
            Find Your <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Support Community</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '28px' }}>
            Join disease-based support groups to share your journey, ask questions, and connect with people who truly understand.
          </p>

          {/* Search Bar */}
          <div className="search-bar" style={{ maxWidth: '480px', margin: '0 auto' }} role="search">
            <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--text-muted)' }} aria-hidden="true"></i>
            <input
              type="text"
              id="community-search"
              placeholder="Search communities, diseases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search communities"
            />
          </div>
        </div>
      </div>

      <div className="page-container" style={{ paddingTop: '36px' }}>
        {/* Filter Pills */}
        <div className="filter-pills" id="filter-pills" role="group" aria-label="Filter communities by disease">
          {['all', 'diabetes', 'cancer', 'heart', 'kidney', 'pcos', 'thyroid', 'asthma', 'mental', 'arthritis', 'online', 'free'].map((filterKey) => (
            <button
              key={filterKey}
              className={`filter-pill ${activeFilter === filterKey ? 'active' : ''}`}
              onClick={() => setActiveFilter(filterKey)}
            >
              {filterKey === 'all' && <><i className="fa-solid fa-border-all"></i> All Communities</>}
              {filterKey === 'diabetes' && '🩸 Diabetes'}
              {filterKey === 'cancer' && '🎗️ Cancer'}
              {filterKey === 'heart' && '❤️ Heart Disease'}
              {filterKey === 'kidney' && '🫘 Kidney'}
              {filterKey === 'pcos' && '🌸 PCOS'}
              {filterKey === 'thyroid' && '🦋 Thyroid'}
              {filterKey === 'asthma' && '💨 Asthma'}
              {filterKey === 'mental' && '🧠 Mental Health'}
              {filterKey === 'arthritis' && '🦴 Arthritis'}
              {filterKey === 'online' && <><i className="fa-solid fa-wifi"></i> Online</>}
              {filterKey === 'free' && <><i className="fa-solid fa-tag"></i> Free</>}
            </button>
          ))}
        </div>

        {/* Split Layout: List + Create Form */}
        <div className="communities-split-container" id="communities-main">
          {/* Left: Communities List */}
          <div className="communities-left-list" id="communities-list">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ textAlign: 'left', margin: 0, fontSize: '1.3rem', color: 'var(--text)' }}>Active Support Groups</h2>
              <span id="community-count" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {filteredCommunities.length} communities found
              </span>
            </div>

            {filteredCommunities.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">👥</span>
                <h3>No Communities Found</h3>
                <p>Be the first to create a support community using the form on the right!</p>
              </div>
            ) : (
              <div id="communities-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredCommunities.map((c, idx) => {
                  const dc = getDc(c.disease);
                  const isJoined = userCommunities.includes(c._id.toString());
                  return (
                    <article key={c._id} className="card community-card" style={{ padding: '24px', textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '14px' }}>
                        <div className="community-card-icon" style={{ background: dc.bg, color: dc.color, flexShrink: 0 }}>
                          {dc.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ textAlign: 'left', fontSize: '1.15rem', margin: '0 0 4px', color: 'var(--text)', fontWeight: 700 }}>
                            {c.name}
                          </h3>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
                            {c.description}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid var(--border-light)' }}>
                        <span className="badge badge-blue"><i className="fa-solid fa-virus"></i> {c.disease}</span>
                        <span className="badge" style={{ background: 'var(--bg-warm)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                          <i className="fa-solid fa-location-dot"></i> {c.location}
                        </span>
                        {c.type === 'online' ? (
                          <span className="badge badge-green"><span className="online-dot"></span> Online</span>
                        ) : (
                          <span className="badge badge-orange"><i className="fa-solid fa-building"></i> In-Person</span>
                        )}
                        {c.paymentType === 'paid' ? (
                          <span className="badge badge-red">Paid — ₹{c.price}</span>
                        ) : (
                          <span className="badge badge-green"><i className="fa-solid fa-circle-check"></i> Free</span>
                        )}
                      </div>

                      <div className="community-actions" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                        {isJoined ? (
                          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                            <button onClick={() => handleLeave(c._id)} className="btn-danger-outline btn-sm" style={{ flex: 1, fontSize: '0.82rem' }}>
                              <i className="fa-solid fa-right-from-bracket"></i> Leave
                            </button>
                            <Link to={`/community/${c._id}`} className="btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                              <i className="fa-solid fa-arrow-right"></i> Enter Group
                            </Link>
                          </div>
                        ) : (
                          <button onClick={() => handleJoin(c._id)} className="btn-success btn-sm btn-block" style={{ fontSize: '0.85rem' }}>
                            <i className="fa-solid fa-user-plus"></i> Join Community
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Create Form */}
          <aside className="communities-right-form" id="create-community-section">
            <h2 style={{ marginTop: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '6px', textAlign: 'center' }}>
              <i className="fa-solid fa-plus-circle" style={{ color: 'var(--primary)', marginRight: '6px' }}></i> Create Support Group
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '20px' }}>Start a community for your condition</p>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label htmlFor="comm-name">Community Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Diabetes Warriors India" />
              </div>
              <div className="form-group">
                <label htmlFor="comm-disease">Target Disease</label>
                <input type="text" value={disease} onChange={(e) => setDisease(e.target.value)} required placeholder="e.g. Type 2 Diabetes" />
              </div>
              <div className="form-group">
                <label htmlFor="comm-location">Location / City</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="e.g. Global, Bangalore" />
              </div>
              <div className="form-group">
                <label htmlFor="comm-type">Meeting Format</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="online">🌐 Online Discussion</option>
                  <option value="offline">🏢 Offline (In-Person)</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="comm-desc">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Describe the purpose..." style={{ minHeight: '80px' }}></textarea>
              </div>
              <button type="submit" className="btn-primary btn-block">Create Community</button>
            </form>
          </aside>
        </div>
      </div>
    </main>
  );
}
