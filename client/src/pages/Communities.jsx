import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Container, Card, FormGroup, Input, Select, Button, PageHeader } from '../components/ui';

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
    const diseaseKey = (diseaseName || '').toLowerCase();
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
    <main style={{ flex: 1 }}>
      <PageHeader
        badge={<><i className="fa-solid fa-heart-pulse"></i> Healthcare Community Directory</>}
        title="Find Your"
        highlight="Support Community"
        subtitle="Join disease-based support groups to share your journey, ask questions, and connect with people who truly understand."
        gradient="primary"
      >
        {/* Search Bar */}
        <div style={{ maxWidth: '480px', margin: 'var(--space-6) auto 0' }} role="search">
          <Input
            type="text"
            placeholder="Search communities, diseases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </PageHeader>

      <Container size="xl">
        {/* Filter Pills */}
        <div className="filter-pills" style={{ marginBottom: 'var(--space-8)' }} role="group">
          {['all', 'diabetes', 'cancer', 'heart', 'kidney', 'pcos', 'thyroid', 'asthma', 'mental', 'arthritis', 'online', 'free'].map((filterKey) => (
            <button
              key={filterKey}
              className={`filter-pill ${activeFilter === filterKey ? 'active' : ''}`}
              onClick={() => setActiveFilter(filterKey)}
            >
              {filterKey === 'all' && <><i className="fa-solid fa-border-all"></i> All Communities</>}
              {filterKey === 'diabetes' && '🩸 Diabetes'}
              {filterKey === 'cancer' && '🎗️ Cancer'}
              {filterKey === 'heart' && '❤️ Heart'}
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
        <div className="communities-split-container">
          {/* Left: Communities List */}
          <div className="communities-left-list">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ textAlign: 'left', margin: 0, fontSize: '1.25rem', color: 'var(--text)' }}>Active Support Groups</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {filteredCommunities.length} communities found
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                <div className="spinner"></div>
              </div>
            ) : filteredCommunities.length === 0 ? (
              <Card padding="lg" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>👥</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 var(--space-2)' }}>No Communities Found</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Be the first to create a support community using the form!
                </p>
              </Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {filteredCommunities.map((c) => {
                  const dc = getDc(c.disease);
                  const isJoined = userCommunities.includes(c._id.toString());
                  return (
                    <Card key={c._id} padding="md" hover>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: dc.bg, color: dc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                          {dc.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ textAlign: 'left', fontSize: '1.15rem', margin: '0 0 4px', color: 'var(--text)', fontWeight: 700 }}>
                            {c.name}
                          </h3>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                            {c.description}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border)' }}>
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

                      <div style={{ paddingTop: 'var(--space-1)' }}>
                        {isJoined ? (
                          <div style={{ display: 'flex', gap: 'var(--space-3)', width: '100%' }}>
                            <Button onClick={() => handleLeave(c._id)} variant="danger" size="sm" style={{ flex: 1 }}>
                              Leave
                            </Button>
                            <Link to={`/community/${c._id}`} style={{ flex: 1, textDecoration: 'none' }}>
                              <Button variant="primary" size="sm" fullWidth icon={<i className="fa-solid fa-arrow-right"></i>}>
                                Enter Group
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <Button onClick={() => handleJoin(c._id)} variant="secondary" size="sm" fullWidth icon={<i className="fa-solid fa-user-plus"></i>}>
                            Join Community
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Create Form */}
          <aside className="communities-right-form">
            <Card accentBorder="primary" padding="lg">
              <h2 style={{ marginTop: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 'var(--space-1)', textAlign: 'center' }}>
                <i className="fa-solid fa-plus-circle" style={{ color: 'var(--primary)', marginRight: '6px' }}></i> Create Support Group
              </h2>
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 'var(--space-5)' }}>Start a community for your condition</p>

              <form onSubmit={handleCreate}>
                <FormGroup label="Community Name" htmlFor="comm-name" required>
                  <Input type="text" id="comm-name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Diabetes Warriors India" />
                </FormGroup>

                <FormGroup label="Target Disease" htmlFor="comm-disease" required>
                  <Input type="text" id="comm-disease" value={disease} onChange={(e) => setDisease(e.target.value)} required placeholder="e.g. Type 2 Diabetes" />
                </FormGroup>

                <FormGroup label="Location / City" htmlFor="comm-location" required>
                  <Input type="text" id="comm-location" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="e.g. Global, Bangalore" />
                </FormGroup>

                <FormGroup label="Meeting Format" htmlFor="comm-type">
                  <Select id="comm-type" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="online">🌐 Online Discussion</option>
                    <option value="offline">🏢 Offline (In-Person)</option>
                  </Select>
                </FormGroup>

                <FormGroup label="Description" htmlFor="comm-desc" required>
                  <textarea
                    id="comm-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Describe the purpose of this community..."
                    style={{
                      width: '100%',
                      minHeight: '88px',
                      padding: 'var(--space-3) var(--space-4)',
                      borderRadius: 'var(--radius)',
                      border: '1.5px solid var(--border)',
                      fontFamily: 'inherit',
                      fontSize: '0.9rem',
                      color: 'var(--text)',
                      outline: 'none',
                    }}
                  ></textarea>
                </FormGroup>

                <Button type="submit" variant="primary" fullWidth style={{ marginTop: 'var(--space-2)' }}>
                  Create Community
                </Button>
              </form>
            </Card>
          </aside>
        </div>
      </Container>
    </main>
  );
}
