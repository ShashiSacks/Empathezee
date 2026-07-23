import React, { useState } from 'react';
import api from '../services/api';
import { Container, Card, FormGroup, Input, Button, PageHeader } from '../components/ui';

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
    <main style={{ flex: 1 }}>
      <PageHeader
        badge={<><i className="fa-solid fa-pills"></i> Verified Medicine Database</>}
        title=""
        highlight="Medicine Search & Order"
        subtitle="Search verified medical databases for instant drug guides, dosages, and book orders."
        gradient="secondary"
      />

      <Container size="md">
        {/* Search Panel */}
        <Card accentBorder="secondary" padding="lg" style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: 'var(--secondary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🔍</div>
            <div>
              <h2 style={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>Medicine Information Search</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Search verified medical guides</p>
            </div>
          </div>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <Input
                type="text"
                placeholder="Search medicine name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary" loading={loading} icon={<i className="fa-solid fa-magnifying-glass"></i>}>
              Search
            </Button>
          </form>

          {loading && (
            <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
              <div className="spinner"></div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div style={{ marginTop: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {searchResults.map((item, idx) => (
                <div key={idx} style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-warm)', borderRadius: 'var(--radius)' }}>
                  <h4 style={{ margin: '0 0 4px', color: 'var(--primary)', fontSize: '0.95rem' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{item.snippet}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Order Panel */}
        <Card accentBorder="primary" padding="lg" style={{ marginBottom: 'var(--space-10)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🛒</div>
            <div>
              <h2 style={{ textAlign: 'left', fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>Quick Medicine Booking</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Order instantly for ₹150 flat rate.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
            <span className="badge badge-green"><i className="fa-solid fa-truck-fast"></i> Fast Delivery</span>
            <span className="badge badge-blue"><i className="fa-solid fa-shield-halved"></i> Secure Checkout</span>
            <span className="badge badge-teal"><i className="fa-solid fa-rotate-left"></i> Easy Returns</span>
          </div>

          {orderStatus && (
            <div style={{ padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius)', background: 'var(--secondary-50)', color: 'var(--secondary-dark)', marginBottom: 'var(--space-4)', fontSize: '0.88rem' }}>
              {orderStatus}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <FormGroup label="Medicine Name" htmlFor="quickOrderMedName" style={{ marginBottom: 0 }}>
                <Input
                  type="text"
                  id="quickOrderMedName"
                  placeholder="e.g. Paracetamol, Metformin..."
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                />
              </FormGroup>
            </div>
            <Button onClick={handleOrder} variant="primary" icon={<i className="fa-solid fa-bag-shopping"></i>}>
              Book & Pay (₹150)
            </Button>
          </div>
        </Card>
      </Container>
    </main>
  );
}
