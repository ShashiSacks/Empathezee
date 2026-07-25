import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Pill, Search, ShoppingCart, Truck, ShieldCheck, RefreshCcw, CreditCard, Clock, Lock, CheckCircle, XCircle } from 'lucide-react';

const CheckoutForm = ({
  medicineName,
  quantity,
  address,
  paymentMethod,
  amount,
  onSuccess,
  onCancel
}) => {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('/api/medicine/order', {
        medicineName,
        quantity,
        address,
        paymentMethod
      });
      const data = res.data;
      onSuccess(data.orderId || `ORD-${Date.now().toString().slice(-6)}`, medicineName, quantity, address);
    } catch (err) {
      setError(err.response?.data?.message || 'Order error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {paymentMethod === 'card' && (
        <div className="form-group">
          <label style={{ textAlign: 'left' }}>Card Information</label>
          <input type="text" placeholder="Card Number (e.g. 4532 •••• •••• 8892)" required />
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <input type="text" placeholder="MM / YY" style={{ flex: 1 }} required />
            <input type="password" placeholder="CVV" style={{ width: '90px' }} required />
          </div>
        </div>
      )}

      {paymentMethod === 'upi' && (
        <div className="form-group">
          <label style={{ textAlign: 'left' }}>UPI ID</label>
          <input type="text" placeholder="e.g. username@okhdfcbank" required />
        </div>
      )}

      {error && <div style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{error}</div>}

      <div style={{ background: 'var(--bg-warm)', padding: '14px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Price per Pack:</span>
          <span style={{ fontWeight: 600 }}>₹{amount / quantity}.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Standard Delivery:</span>
          <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Included</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)' }}>
          <span>Total Amount:</span>
          <span style={{ color: 'var(--primary)' }}>₹{amount}.00</span>
        </div>
      </div>

      <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-full)', padding: '12px', width: '100%', fontWeight: 600, marginTop: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }} disabled={loading}>
        {loading ? 'Processing...' : <><Lock size={16} /> Pay & Confirm Order</>}
      </button>
      <button type="button" onClick={onCancel} style={{ background: 'transparent', border: '1.5px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-full)', padding: '10px', width: '100%', fontWeight: 500, marginTop: '4px', display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
        Cancel
      </button>
    </form>
  );
};

const Medicine = () => {
  const { user } = useAuth();
  
  const [searchMode, setSearchMode] = useState('medicine'); // 'medicine' or 'disease'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [quickOrderName, setQuickOrderName] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Modal State
  const [medName, setMedName] = useState('');
  const [medQty, setMedQty] = useState(1);
  const [medPrice, setMedPrice] = useState(150);
  const [address, setAddress] = useState(user?.city ? `${user.city}, India` : '');
  const [paymentOption, setPaymentOption] = useState('upi');
  
  const [successData, setSuccessData] = useState(null);

  const fetchSearch = async (term) => {
    if (!term || !term.trim()) return;
    setSearchLoading(true);
    setSearched(true);
    try {
      const res = await axios.get(`/api/medicine/search?query=${encodeURIComponent(term.trim())}`);
      setSearchResults(res.data.results || []);
    } catch (err) {
      console.error('Search Error:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    fetchSearch(searchQuery);
  };

  const openOrderModal = (name, price = 150) => {
    setMedName(name);
    setMedPrice(price);
    setMedQty(1);
    setAddress(user?.city ? `${user.city}, India` : '');
    setSuccessData(null);
    setShowModal(true);
  };

  const handleQuickOrder = () => {
    if (!quickOrderName.trim()) return;
    openOrderModal(quickOrderName.trim(), 150);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSuccess = (orderId, med, qty, addr) => {
    setSuccessData({ orderId, medicineName: med, quantity: qty, address: addr });
  };

  const totalAmount = medQty * medPrice;

  return (
    <main>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(145deg, var(--primary-50) 0%, #FFFFFF 100%)',
        padding: '60px 24px 48px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'var(--primary-50)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '20px' }}>
            <Pill size={14} /> Verified Pharmaceutical Directory
          </div>
          <h1 className="title" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '10px' }}>
            <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Medicine</span> Search & Order
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 0 }}>
            Search verified medical databases for drug guides, dosages, indications, and order prescribed medicines directly.
          </p>
        </div>
      </div>

      <div className="page-container" style={{ maxWidth: '880px', paddingTop: '40px' }}>
        
        {/* Verified Medicine Search Panel */}
        <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Search size={24} />
            </div>
            <div>
              <h2 style={{ textAlign: 'left', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>Medicine & Disease Search</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Search verified pharmaceutical drug guides by medicine name or disease/condition</p>
            </div>
          </div>

          {/* Search Mode Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: 'var(--bg-warm)', padding: '4px', borderRadius: 'var(--radius-full)', width: 'fit-content' }}>
            <button
              type="button"
              onClick={() => setSearchMode('medicine')}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: searchMode === 'medicine' ? 'var(--primary)' : 'transparent',
                color: searchMode === 'medicine' ? 'white' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              💊 By Medicine Name
            </button>
            <button
              type="button"
              onClick={() => setSearchMode('disease')}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: searchMode === 'disease' ? 'var(--primary)' : 'transparent',
                color: searchMode === 'disease' ? 'white' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              🩺 By Disease / Condition
            </button>
          </div>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <input 
              type="text" 
              placeholder={searchMode === 'medicine' ? "Enter medicine name (e.g. Oflox OZ, Dolo 650, Pan 40, Augmentin)..." : "Enter disease or symptom (e.g. Diarrhea, Fever, Acidity, Headache, Allergy)..."} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius)', border: '1.5px solid var(--border)', fontSize: '0.92rem' }}
            />
            <button 
              type="submit" 
              disabled={searchLoading || !searchQuery.trim()}
              style={{ 
                background: 'var(--primary)', 
                color: 'white', 
                border: 'none', 
                padding: '12px 24px', 
                borderRadius: 'var(--radius-full)', 
                fontWeight: 600, 
                fontSize: '0.9rem', 
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {searchLoading ? <RefreshCcw size={16} className="animate-spin" /> : <Search size={16} />}
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Quick Disease / Symptom Filter Chips */}
          <div style={{ marginBottom: '8px', textAlign: 'left' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Quick Search by Health Condition / Disease:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { label: '🦠 Diarrhea & Infection', term: 'diarrhea' },
                { label: '🌡️ Fever & Pain', term: 'fever' },
                { label: '🔥 Acidity & GERD', term: 'acidity' },
                { label: '🤕 Headache & Migraine', term: 'headache' },
                { label: '🩸 Diabetes & Sugar', term: 'diabetes' },
                { label: '🤧 Allergies & Asthma', term: 'allergy' },
                { label: '👄 Mouth Ulcers', term: 'ulcers' },
                { label: '🦴 Joint & Arthritis', term: 'arthritis' },
                { label: '💊 HIV & Chronic Care', term: 'hiv' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchMode('disease');
                    setSearchQuery(chip.term);
                    fetchSearch(chip.term);
                  }}
                  style={{
                    background: searchQuery.toLowerCase() === chip.term.toLowerCase() ? 'var(--primary)' : 'var(--primary-50)',
                    color: searchQuery.toLowerCase() === chip.term.toLowerCase() ? 'white' : 'var(--primary)',
                    border: '1px solid rgba(79,70,229,0.2)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {searched && (
            <div style={{ marginTop: '24px' }}>
              {searchLoading ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Searching verified drug database...
                </div>
              ) : searchResults.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {searchResults.map((item, idx) => (
                    <div key={idx} style={{ padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--surface)', textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>{item.name}</h3>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--primary-50)', color: 'var(--primary)' }}>
                              {item.category}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Generic: {item.genericName}</p>
                        </div>
                        <button 
                          onClick={() => openOrderModal(item.name, item.price || 150)}
                          style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 18px',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <ShoppingCart size={14} /> Order Medicine
                        </button>
                      </div>

                      <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                        <div><strong>Uses:</strong> {item.uses}</div>
                        <div><strong>Dosage:</strong> {item.dosage}</div>
                        <div><strong>Precautions:</strong> {item.precautions}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Manufacturer: {item.manufacturer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-warm)', borderRadius: 'var(--radius-lg)' }}>
                  No exact records found. You can still order this medicine directly below.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Order Panel */}
        <div className="card" style={{ padding: '32px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <ShoppingCart size={24} />
            </div>
            <div>
              <h2 style={{ textAlign: 'left', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>Quick Medicine Booking</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Order verified prescription & OTC medicines directly to your address.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Truck size={14} /> Fast Delivery</span>
            <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} /> Secure Checkout</span>
            <span className="badge badge-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><RefreshCcw size={14} /> Easy Returns</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }} className="form-group">
              <label style={{ fontSize: '0.85rem', textAlign: 'left' }}>Medicine Name</label>
              <input type="text" placeholder="e.g. Mucopain, Paracetamol, Metformin..." value={quickOrderName} onChange={e => setQuickOrderName(e.target.value)} />
            </div>
            <button onClick={handleQuickOrder} style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-full)', fontWeight: 600, flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <ShoppingCart size={18} /> Book & Order
            </button>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px', padding: '16px', background: 'var(--bg-warm)', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid var(--border)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={16} style={{ color: 'var(--primary)' }} /> <strong>100% Genuine</strong> Prescription Medicines</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Truck size={16} style={{ color: 'var(--primary)' }} /> <strong>Doorstep</strong> Delivery</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CreditCard size={16} style={{ color: 'var(--primary)' }} /> UPI · Card · COD</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} style={{ color: 'var(--primary)' }} /> 2–4 Day Delivery</span>
          </div>
        </div>

        {/* Info Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--primary)' }}><Pill size={36} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>10,000+ Medicines</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Verified drug database</p>
          </div>
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--primary)' }}><ShieldCheck size={36} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>100% Secure</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Stripe-secured payments</p>
          </div>
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--primary)' }}><Truck size={36} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>Doorstep Delivery</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Pan-India coverage</p>
          </div>
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--primary)' }}><Clock size={36} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>Fast Delivery</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Within 2–4 business days</p>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
          <div style={{ width: '100%', maxWidth: '520px', background: 'var(--surface)', borderRadius: '24px', boxShadow: 'var(--shadow-2xl)', padding: '32px', textAlign: 'left', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '24px', right: '24px', width: '32px', height: '32px', border: 'none', background: 'var(--bg-warm)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <XCircle size={20} />
            </button>

            {!successData ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--grad-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <ShoppingCart size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text)', textAlign: 'left' }}>Book & Pay for Medicine</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Secure checkout powered by Stripe</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label style={{ textAlign: 'left' }}>Medicine Name</label>
                    <input type="text" required value={medName} onChange={e => setMedName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label style={{ textAlign: 'left' }}>Quantity</label>
                    <select value={medQty} onChange={e => setMedQty(parseInt(e.target.value, 10))}>
                      <option value="1">1 Pack / Bottle</option>
                      <option value="2">2 Packs / Bottles</option>
                      <option value="3">3 Packs / Bottles</option>
                      <option value="5">5 Packs / Bottles</option>
                      <option value="10">10 Packs / Bottles</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ textAlign: 'left' }}>Delivery Address</label>
                    <textarea required value={address} onChange={e => setAddress(e.target.value)} style={{ minHeight: '80px' }}></textarea>
                  </div>
                  <div className="form-group">
                    <label style={{ textAlign: 'left' }}>Payment Method</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                        <input type="radio" name="paymentOption" value="upi" checked={paymentOption === 'upi'} onChange={() => setPaymentOption('upi')} style={{ width: 'auto' }} /> 📱 UPI (GPay, PhonePe, Paytm)
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                        <input type="radio" name="paymentOption" value="card" checked={paymentOption === 'card'} onChange={() => setPaymentOption('card')} style={{ width: 'auto' }} /> 💳 Credit / Debit Card
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                        <input type="radio" name="paymentOption" value="cod" checked={paymentOption === 'cod'} onChange={() => setPaymentOption('cod')} style={{ width: 'auto' }} /> 💵 Cash on Delivery (COD)
                      </label>
                    </div>
                  </div>

                  <CheckoutForm 
                    medicineName={medName}
                    quantity={medQty}
                    address={address}
                    paymentMethod={paymentOption}
                    amount={totalAmount}
                    onSuccess={handleSuccess}
                    onCancel={closeModal}
                  />
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--secondary-50)', color: 'var(--secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle size={40} />
                </div>
                <h3 style={{ color: 'var(--secondary-dark)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Booking Confirmed!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>Your payment was successful. Your medicine is on its way!</p>

                <div style={{ background: 'var(--bg-warm)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', textAlign: 'left', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div><strong>Order ID:</strong> <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700, marginLeft: '8px' }}>{successData.orderId}</span></div>
                  <div><strong>Medicine:</strong> <span style={{ marginLeft: '8px' }}>{successData.medicineName}</span></div>
                  <div><strong>Quantity:</strong> <span style={{ marginLeft: '8px' }}>{successData.quantity} Pack(s)</span></div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <strong>Deliver to:</strong> <span style={{ marginLeft: '8px', flex: 1 }}>{successData.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <strong>Status:</strong> <span className="badge badge-green" style={{ marginLeft: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} /> Processing</span>
                  </div>
                </div>

                <button onClick={closeModal} className="btn-gradient btn-block" style={{ marginTop: '32px', padding: '14px', fontSize: '1rem', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <CheckCircle size={18} /> Close Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Medicine;
