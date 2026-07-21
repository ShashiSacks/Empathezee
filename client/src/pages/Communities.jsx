import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, Search, LayoutGrid, Wifi, Tag, 
  MapPin, Building, IndianRupee, CheckCircle, 
  Calendar, Clock, LogOut, ArrowRight, UserPlus, 
  PlusCircle, Rocket, Star, Activity 
} from 'lucide-react';

const Communities = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createData, setCreateData] = useState({
    name: '',
    disease: '',
    location: '',
    type: 'online',
    meetingDate: '',
    meetingTime: '',
    meetingPlace: '',
    paymentType: 'free',
    price: '',
    description: ''
  });

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/communities');
      setCommunities(res.data);
    } catch (err) {
      setError('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const userCommunities = user?.communities || [];
  const userDisease = user?.disease || '';

  const filteredCommunities = useMemo(() => {
    return communities.filter(c => {
      const disease = (c.disease || '').toLowerCase();
      const type = (c.type || '');
      const payment = (c.paymentType || '');
      const name = (c.name || '').toLowerCase();
      
      let matchFilter = true;
      if (filter === 'online') matchFilter = type === 'online';
      else if (filter === 'free') matchFilter = payment === 'free';
      else if (filter !== 'all') matchFilter = disease.includes(filter);
      
      const matchSearch = search === '' || 
        disease.includes(search.toLowerCase()) || 
        name.includes(search.toLowerCase());
        
      return matchFilter && matchSearch;
    });
  }, [communities, filter, search]);

  const handleJoinLeave = async (e, communityId, action) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/communities/${communityId}/${action}`);
      if (res.data.communities) {
        setUser(prev => ({ ...prev, communities: res.data.communities }));
      }
    } catch (err) {
      alert(`Failed to ${action} community.`);
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new URLSearchParams();
      Object.keys(createData).forEach(k => {
        if (createData[k] !== undefined && createData[k] !== null) {
          payload.append(k, createData[k]);
        }
      });
      
      const res = await axios.post('/api/communities', payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      setCommunities([res.data, ...communities]);
      setCreateData({
        name: '', disease: '', location: '', type: 'online', 
        meetingDate: '', meetingTime: '', meetingPlace: '', 
        paymentType: 'free', price: '', description: ''
      });
      alert('Community created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create community');
    }
  };

  const getDiseaseColors = (disease) => {
    const diseaseKey = (disease || '').toLowerCase();
    if (diseaseKey.includes('diabet')) return { bg: '#FEF3C7', color: '#D97706', icon: '🩸' };
    if (diseaseKey.includes('cancer')) return { bg: '#FDF2F8', color: '#9D174D', icon: '🎗️' };
    if (diseaseKey.includes('heart')) return { bg: '#FFF1F2', color: '#BE123C', icon: '❤️' };
    if (diseaseKey.includes('kidney')) return { bg: '#F0FDF4', color: '#166534', icon: '🫘' };
    if (diseaseKey.includes('pcos')) return { bg: '#FDF4FF', color: '#7E22CE', icon: '🌸' };
    if (diseaseKey.includes('thyroid')) return { bg: '#FFFBEB', color: '#92400E', icon: '🦋' };
    if (diseaseKey.includes('asthma')) return { bg: '#EFF6FF', color: '#1D4ED8', icon: '💨' };
    if (diseaseKey.includes('mental')) return { bg: '#F5F3FF', color: '#5B21B6', icon: '🧠' };
    if (diseaseKey.includes('arthrit')) return { bg: '#FFF7ED', color: '#C2410C', icon: '🦴' };
    if (diseaseKey.includes('ms')) return { bg: '#F0F9FF', color: '#0369A1', icon: '🔵' };
    return { bg: 'var(--primary-50)', color: 'var(--primary)', icon: '🏥' };
  };

  if (loading) {
    return (
      <main className="page-container" style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px', borderTopColor: 'var(--primary)' }}></div>
      </main>
    );
  }

  return (
    <main>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(145deg, var(--primary-50) 0%, var(--accent-50) 50%, var(--secondary-50) 100%)',
        padding: '64px 24px 48px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(37,99,235,0.08), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-60px', left: '-20px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(20,184,166,0.07), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.16)', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '20px' }}>
            <HeartPulse size={14} /> Healthcare Community Platform
          </div>

          <h1 className="title" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '12px' }}>
            Find Your <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Support Community</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '28px' }}>
            Join disease-based support groups to share your journey, ask questions, and connect with people who truly understand.
          </p>

          <div className="search-bar" style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', background: 'var(--surface)', padding: '6px', borderRadius: '999px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
            <div style={{ padding: '0 12px', color: 'var(--text-muted)' }}>
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search communities, diseases..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', padding: '12px 0', fontSize: '0.95rem' }}
            />
            <button className="btn-primary btn-sm" style={{ borderRadius: '999px', padding: '10px 20px', fontWeight: 600 }}>Search</button>
          </div>
        </div>
      </div>

      <div className="page-container" style={{ paddingTop: '36px' }}>
        
        {/* Filter Pills */}
        <div className="filter-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '32px' }}>
          <button className={`filter-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}><LayoutGrid size={14} /> All</button>
          <button className={`filter-pill ${filter === 'diabetes' ? 'active' : ''}`} onClick={() => setFilter('diabetes')}>🩸 Diabetes</button>
          <button className={`filter-pill ${filter === 'cancer' ? 'active' : ''}`} onClick={() => setFilter('cancer')}>🎗️ Cancer</button>
          <button className={`filter-pill ${filter === 'heart' ? 'active' : ''}`} onClick={() => setFilter('heart')}>❤️ Heart Disease</button>
          <button className={`filter-pill ${filter === 'kidney' ? 'active' : ''}`} onClick={() => setFilter('kidney')}>🫘 Kidney</button>
          <button className={`filter-pill ${filter === 'pcos' ? 'active' : ''}`} onClick={() => setFilter('pcos')}>🌸 PCOS</button>
          <button className={`filter-pill ${filter === 'thyroid' ? 'active' : ''}`} onClick={() => setFilter('thyroid')}>🦋 Thyroid</button>
          <button className={`filter-pill ${filter === 'asthma' ? 'active' : ''}`} onClick={() => setFilter('asthma')}>💨 Asthma</button>
          <button className={`filter-pill ${filter === 'mental' ? 'active' : ''}`} onClick={() => setFilter('mental')}>🧠 Mental Health</button>
          <button className={`filter-pill ${filter === 'arthritis' ? 'active' : ''}`} onClick={() => setFilter('arthritis')}>🦴 Arthritis</button>
          <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 4px' }}></div>
          <button className={`filter-pill ${filter === 'online' ? 'active' : ''}`} onClick={() => setFilter('online')}><Wifi size={14} /> Online</button>
          <button className={`filter-pill ${filter === 'free' ? 'active' : ''}`} onClick={() => setFilter('free')}><Tag size={14} /> Free</button>
        </div>

        <div className="communities-split-container" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Left: Communities List */}
          <div className="communities-left-list" style={{ flex: '1 1 60%', minWidth: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ textAlign: 'left', margin: 0, fontSize: '1.3rem', color: 'var(--text)' }}>Active Support Groups</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, background: 'var(--bg-warm)', padding: '4px 12px', borderRadius: '20px' }}>{filteredCommunities.length} group{filteredCommunities.length !== 1 ? 's' : ''} found</span>
            </div>

            {filteredCommunities.length === 0 ? (
              <div className="card" style={{ padding: '48px 32px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                  <Search size={48} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>No communities found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Try a different filter or search term, or create your own community on the right.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredCommunities.map((c, idx) => {
                  const isRecommended = userDisease && c.disease.toLowerCase().includes(userDisease.toLowerCase());
                  const dc = getDiseaseColors(c.disease);
                  const isMember = userCommunities.includes(c._id);

                  return (
                    <article key={c._id} className={`card ${isRecommended ? 'highlight-card' : ''}`} style={{ animationDelay: `${idx * 0.05}s`, borderColor: isRecommended ? 'var(--primary-light)' : 'var(--border)' }}>
                      <div className="card-body">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', background: dc.bg, color: dc.color, flexShrink: 0 }}>
                            {dc.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {isRecommended && (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-50)', padding: '4px 10px', borderRadius: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <Star size={12} fill="currentColor" /> Matches Your Profile
                              </div>
                            )}
                            <h3 style={{ textAlign: 'left', fontSize: '1.25rem', margin: '0 0 6px', color: 'var(--text)', fontWeight: 700, lineHeight: 1.3 }}>{c.name}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {c.description}
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                          <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} /> {c.disease}</span>
                          <span className="badge" style={{ background: 'var(--bg-warm)', color: 'var(--text-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {c.location}</span>
                          
                          {c.type === 'online' ? (
                            <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span className="online-dot"></span> Online</span>
                          ) : (
                            <span className="badge badge-orange" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Building size={14} /> In-Person</span>
                          )}
                          
                          {c.paymentType === 'paid' ? (
                            <span className="badge badge-red" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IndianRupee size={14} /> Paid — ₹{c.price}</span>
                          ) : (
                            <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} /> Free</span>
                          )}
                        </div>

                        {c.type === 'offline' && (
                          <div style={{ background: 'var(--warning-bg)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.2)', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} style={{ color: 'var(--warning)' }} /> <b style={{ color: 'var(--text)' }}>Date:</b> {c.meetingDate}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} style={{ color: 'var(--warning)' }} /> <b style={{ color: 'var(--text)' }}>Time:</b> {c.meetingTime}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} style={{ color: 'var(--warning)' }} /> <b style={{ color: 'var(--text)' }}>Place:</b> {c.meetingPlace}</span>
                          </div>
                        )}

                        <div className="community-actions" style={{ display: 'flex', gap: '12px' }}>
                          {isMember ? (
                            <>
                              <button onClick={(e) => handleJoinLeave(e, c._id, 'leave')} className="btn-outline btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--danger)', borderColor: 'var(--border)' }}>
                                <LogOut size={16} /> Leave
                              </button>
                              <Link to={`/community/${c._id}`} className="btn-primary btn-sm" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                Enter Group <ArrowRight size={16} />
                              </Link>
                            </>
                          ) : (
                            <button onClick={(e) => handleJoinLeave(e, c._id, 'join')} className="btn-success btn-sm btn-block" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                              <UserPlus size={16} /> Join Community
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Create Community Form */}
          <aside className="communities-right-form" style={{ flex: '1 1 30%', minWidth: '300px' }}>
            <div className="card" style={{ position: 'sticky', top: '100px' }}>
              <div className="card-body">
                <h2 style={{ marginTop: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <PlusCircle size={20} style={{ color: 'var(--primary)' }} />
                  Create Support Group
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>Start a community for your condition</p>

                <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem' }}>Community Name</label>
                    <input type="text" name="name" required placeholder="e.g. Diabetes Warriors India" value={createData.name} onChange={handleCreateChange} style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem' }}>Target Disease</label>
                    <input type="text" name="disease" required placeholder="e.g. Type 2 Diabetes" value={createData.disease} onChange={handleCreateChange} style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem' }}>Location / City</label>
                    <input type="text" name="location" required placeholder="e.g. Global, Bangalore" value={createData.location} onChange={handleCreateChange} style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem' }}>Meeting Format</label>
                    <select name="type" required value={createData.type} onChange={handleCreateChange} style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem' }}>
                      <option value="online">🌐 Online Discussion</option>
                      <option value="offline">🏢 Offline (In-Person)</option>
                    </select>
                  </div>

                  {createData.type === 'offline' && (
                    <div style={{ borderLeft: '3px solid var(--warning)', paddingLeft: '16px', gap: '16px', display: 'flex', flexDirection: 'column' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem' }}>Meeting Date</label>
                        <input type="date" name="meetingDate" required value={createData.meetingDate} onChange={handleCreateChange} style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem' }} />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem' }}>Meeting Time</label>
                        <input type="time" name="meetingTime" required value={createData.meetingTime} onChange={handleCreateChange} style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem' }} />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem' }}>Meeting Address</label>
                        <input type="text" name="meetingPlace" required placeholder="e.g. City Hall, Room 3" value={createData.meetingPlace} onChange={handleCreateChange} style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem' }} />
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem' }}>Payment Access</label>
                    <select name="paymentType" required value={createData.paymentType} onChange={handleCreateChange} style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem' }}>
                      <option value="free">🟢 Free Access</option>
                      <option value="paid">💳 Paid Entry</option>
                    </select>
                  </div>

                  {createData.paymentType === 'paid' && (
                    <div style={{ borderLeft: '3px solid var(--danger)', paddingLeft: '16px' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem' }}>Entry Price (₹)</label>
                        <input type="number" name="price" required min="0" step="1" placeholder="e.g. 150" value={createData.price} onChange={handleCreateChange} style={{ padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem' }} />
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem' }}>Description / Guidelines</label>
                    <textarea name="description" required placeholder="Describe your community goals, rules, and topics..." value={createData.description} onChange={handleCreateChange} style={{ padding: '12px 14px', borderRadius: '10px', fontSize: '0.9rem', minHeight: '100px' }}></textarea>
                  </div>

                  <button type="submit" className="btn-gradient btn-block" style={{ marginTop: '8px', padding: '12px', fontSize: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Rocket size={18} /> Create Community
                  </button>
                </form>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
};

export default Communities;
