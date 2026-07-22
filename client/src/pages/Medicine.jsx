import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Pill, Search, ShoppingCart, Truck, ShieldCheck, RefreshCcw, IndianRupee, CreditCard, Clock, Lock, CheckCircle, XCircle } from 'lucide-react';

const CheckoutForm = ({
  medicineName,
  quantity,
  address,
  paymentMethod,
  amount,
  onSuccess,
  onCancel
}) => {
  const stripe = useStripe();
  const elements = useElements();
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

      if (data.requiresAction && paymentMethod === 'card') {
        if (!stripe || !elements) {
          setError('Stripe has not loaded yet.');
          setLoading(false);
          return;
        }

        const cardElement = elements.getElement(CardElement);
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user?.username || 'Guest',
              email: user?.email || ''
            }
          }
        });

        if (stripeError) {
          setError(stripeError.message);
          setLoading(false);
          return;
        }

        if (paymentIntent.status === 'succeeded') {
          await axios.post('/api/medicine/confirm-payment', {
            orderId: data.orderId,
            paymentIntentId: paymentIntent.id
          });
          onSuccess(data.orderId, medicineName, quantity, address);
        } else {
          setError('Payment was not successful.');
        }
      } else {
        // UPI or COD
        onSuccess(data.orderId, medicineName, quantity, address);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment error. Please try again.');
    } finally {
      if (!error) setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {paymentMethod === 'card' && (
        <div className="form-group">
          <label style={{ textAlign: 'left' }}>Card Details (Stripe Secured)</label>
          <div style={{ padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)' }}>
            <CardElement options={{
              style: {
                base: {
                  color: '#1E293B',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSmoothing: 'antialiased',
                  fontSize: '14px',
                  '::placeholder': { color: '#94A3B8' }
                },
                invalid: { color: '#EF4444', iconColor: '#EF4444' }
              }
            }} />
          </div>
          {error && <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '4px' }}>{error}</div>}
        </div>
      )}

      {paymentMethod === 'upi' && (
        <div className="form-group">
          <label style={{ textAlign: 'left' }}>UPI ID</label>
          <input type="text" placeholder="e.g. user@okhdfcbank" />
        </div>
      )}

      <div style={{ background: 'var(--bg-warm)', padding: '14px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Unit Price:</span>
          <span style={{ fontWeight: 600 }}>₹150.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Delivery:</span>
          <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>FREE</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)' }}>
          <span>Total Amount:</span>
          <span style={{ color: 'var(--primary)' }}>₹{amount}.00</span>
        </div>
      </div>

      <button type="submit" className="btn-gradient btn-block" style={{ marginTop: '4px', display: 'flex', justifyContent: 'center', gap: '8px' }} disabled={loading || (paymentMethod === 'card' && !stripe)}>
        {loading ? 'Processing...' : <><Lock size={16} /> Pay & Confirm Order</>}
      </button>
      <button type="button" onClick={onCancel} className="btn-danger-outline btn-block" style={{ marginTop: '4px', display: 'flex', justifyContent: 'center' }}>
        Cancel
      </button>
    </form>
  );
};

const Medicine = () => {
  const { user } = useAuth();
  
  const [quickOrderName, setQuickOrderName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);

  // Modal State
  const [medName, setMedName] = useState('');
  const [medQty, setMedQty] = useState(1);
  const [address, setAddress] = useState(user?.city ? `${user.city}, India` : '');
  const [paymentOption, setPaymentOption] = useState('upi');
  
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    // Load Google Custom Search
    const script = document.createElement('script');
    script.src = 'https://cse.google.com/cse.js?cx=b1c032ebe988b40d9';
    script.async = true;
    document.body.appendChild(script);

    // Fetch Stripe Key
    axios.get('/api/medicine/stripe-key')
      .then(res => {
        if (res.data.stripePublishableKey) {
          setStripePromise(loadStripe(res.data.stripePublishableKey));
        }
      })
      .catch(err => console.error('Error fetching Stripe key:', err));

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleQuickOrder = () => {
    if (!quickOrderName.trim()) return;
    setMedName(quickOrderName.trim());
    setMedQty(1);
    setAddress(user?.city ? `${user.city}, India` : '');
    setSuccessData(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSuccess = (orderId, med, qty, addr) => {
    setSuccessData({ orderId, medicineName: med, quantity: qty, address: addr });
  };

  const totalAmount = medQty * 150;

  return (
    <main>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(145deg, var(--secondary-50) 0%, var(--primary-50) 100%)',
        padding: '60px 24px 48px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '-30px', right: '-20px', width: '200px', height: '200px', background: 'radial-gradient(circle,rgba(16,185,129,0.07),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-50px', left: '-20px', width: '180px', height: '180px', background: 'radial-gradient(circle,rgba(37,99,235,0.06),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--secondary-dark)', marginBottom: '20px' }}>
            <Pill size={14} /> Verified Medicine Database
          </div>
          <h1 className="title" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '10px' }}>
            <span style={{ background: 'linear-gradient(135deg,var(--secondary),var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Medicine</span> Search & Order
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 0 }}>
            Search verified medical databases (Mayo Clinic, WebMD, NIH, Wikipedia) for instant drug guides, dosages, and book orders.
          </p>
        </div>
      </div>

      <div className="page-container" style={{ maxWidth: '860px', paddingTop: '40px' }}>
        
        {/* Google CSE Panel */}
        <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--secondary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
              <Search size={24} />
            </div>
            <div>
              <h2 style={{ textAlign: 'left', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>Medicine Information Search</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Searches Mayo Clinic, WebMD, NIH & Wikipedia</p>
            </div>
          </div>
          <div className="gcse-search"></div>
        </div>

        {/* Quick Order Panel */}
        <div className="card" style={{ padding: '32px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <ShoppingCart size={24} />
            </div>
            <div>
              <h2 style={{ textAlign: 'left', fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>Quick Medicine Booking</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Found the medicine above? Order it instantly for ₹150 flat rate.</p>
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
              <input type="text" placeholder="e.g. Dolutegravir, Paracetamol, Metformin..." value={quickOrderName} onChange={e => setQuickOrderName(e.target.value)} />
            </div>
            <button onClick={handleQuickOrder} className="btn-gradient" style={{ padding: '12px 24px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} /> Book & Pay
            </button>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px', padding: '16px', background: 'var(--bg-warm)', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid var(--border)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><IndianRupee size={16} style={{ color: 'var(--secondary)' }} /> <strong>₹150</strong> per pack</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Truck size={16} style={{ color: 'var(--accent)' }} /> <strong style={{ color: 'var(--secondary)' }}>Free</strong> delivery</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CreditCard size={16} style={{ color: 'var(--primary)' }} /> UPI · Card · COD</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} style={{ color: 'var(--warning)' }} /> 2–4 day delivery</span>
          </div>
        </div>

        {/* Info Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--secondary)' }}><Pill size={36} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>10,000+ Medicines</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Verified drug database</p>
          </div>
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--primary)' }}><ShieldCheck size={36} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>100% Secure</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Stripe-secured payments</p>
          </div>
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--accent)' }}><Truck size={36} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>Free Delivery</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>On all orders</p>
          </div>
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--warning)' }}><Clock size={36} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>2–4 Day Delivery</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Pan-India coverage</p>
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

                  {stripePromise && paymentOption === 'card' ? (
                    <Elements stripe={stripePromise}>
                      <CheckoutForm 
                        medicineName={medName}
                        quantity={medQty}
                        address={address}
                        paymentMethod={paymentOption}
                        amount={totalAmount}
                        onSuccess={handleSuccess}
                        onCancel={closeModal}
                      />
                    </Elements>
                  ) : (
                    <CheckoutForm 
                      medicineName={medName}
                      quantity={medQty}
                      address={address}
                      paymentMethod={paymentOption}
                      amount={totalAmount}
                      onSuccess={handleSuccess}
                      onCancel={closeModal}
                    />
                  )}
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
