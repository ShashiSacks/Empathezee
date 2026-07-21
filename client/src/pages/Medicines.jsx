import React, { useState } from 'react';
import api from '../services/api';

export default function Medicines() {
  const [medName, setMedName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const res = await api.get(`/api/medicine/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!medName.trim()) return;
    setOrderStatus('Processing order...');
    try {
      await api.post('/api/medicine/order', { name: medName, price: 150 });
      setOrderStatus(`Order placed successfully for ${medName}! Flat rate: ₹150`);
      setMedName('');
    } catch (err) {
      console.error(err);
      setOrderStatus('Failed to place order. Please try again.');
    }
  };

  return (
    <main>
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(145deg, var(--secondary-50) 0%, var(--primary-50) 100%)', padding: '60px 24px 48px', textAlign: 'center', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--secondary-dark)', marginBottom: '20px' }}>
            <i className="fa-solid fa-pills"></i> Verified Medicine Database
          </div>
          <h1 className="title" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', marginBottom: '10px' }}>
            <span style={{ background: 'linear-gradient(135deg,var(--secondary),var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Medicine</span> Search & Order
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 0 }}>
            Search verified medical databases for instant drug guides, dosages, and book orders.
          </p>
        </div>
      </div>

      <div className="page-container" style={{ maxWidth: '860px', paddingTop: '40px' }}>
        {/* Search Panel */}
        <div className="card" style={{ padding: '32px', marginBottom: '32px', borderTop: '3px solid var(--secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: 'var(--secondary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🔍</div>
            <div>
              <h2 style={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>Medicine Information Search</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>Search verified medical guides</p>
            </div>
          </div>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Search medicine name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              <i className="fa-solid fa-magnifying-glass"></i> Search
            </button>
          </form>

          {loading && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div className="spinner"></div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {searchResults.map((item, idx) => (
                <div key={idx} style={{ padding: '12px', background: 'var(--bg-warm)', borderRadius: 'var(--radius)' }}>
                  <h4 style={{ margin: '0 0 4px', color: 'var(--primary)' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{item.snippet}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Order Panel */}
        <div className="card" style={{ padding: '32px', marginBottom: '40px', borderTop: '3px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🛒</div>
            <div>
              <h2 style={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>Quick Medicine Booking</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>Order instantly for ₹150 flat rate.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span className="badge badge-green"><i className="fa-solid fa-truck-fast"></i> Fast Delivery</span>
            <span className="badge badge-blue"><i className="fa-solid fa-shield-halved"></i> Secure Checkout</span>
            <span className="badge badge-teal"><i className="fa-solid fa-rotate-left"></i> Easy Returns</span>
          </div>

          {orderStatus && (
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius)', background: 'var(--secondary-50)', color: 'var(--secondary-dark)', marginBottom: '16px', fontSize: '0.88rem' }}>
              {orderStatus}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }} className="form-group">
              <label htmlFor="quickOrderMedName" style={{ fontSize: '0.78rem', textAlign: 'left' }}>Medicine Name</label>
              <input
                type="text"
                id="quickOrderMedName"
                placeholder="e.g. Paracetamol, Metformin..."
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
              />
            </div>
            <button onClick={handleOrder} className="btn-gradient" style={{ padding: '11px 24px', flexShrink: 0 }}>
              <i className="fa-solid fa-bag-shopping"></i> Book & Pay (₹150)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
