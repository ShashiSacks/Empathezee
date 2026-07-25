import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import DoctorLogin from './pages/DoctorLogin';
import Register from './pages/Register';
import DoctorRegister from './pages/DoctorRegister';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Communities from './pages/Communities';
import CommunityDetail from './pages/CommunityDetail';
import DoctorSearch from './pages/DoctorSearch';
import Appointments from './pages/Appointments';
import Medicines from './pages/Medicines';
import Wellness from './pages/Wellness';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Terms from './pages/Terms';

// ProtectedRoute component to enforce authentication and role separation
function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{ width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={allowedRole === 'doctor' ? '/doctor/login' : '/login'} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard'} replace />;
  }

  return children;
}

// PublicOnlyRoute redirects logged-in users away from login/register pages to their dashboard
function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard'} replace />;
  }

  return children;
}

// LandingRoute redirects logged-in users to their dashboard
function LandingRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard'} replace />;
  }

  return <Landing />;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const authRoutes = ['/login', '/register', '/doctor/login', '/doctor/register'];
    if (authRoutes.includes(location.pathname)) {
      document.body.classList.add('auth-page');
    } else {
      document.body.classList.remove('auth-page');
    }
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, [location.pathname]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* Public / Guest Routes */}
          <Route path="/" element={<LandingRoute />} />
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/doctor/login" element={<PublicOnlyRoute><DoctorLogin /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          <Route path="/doctor/register" element={<PublicOnlyRoute><DoctorRegister /></PublicOnlyRoute>} />
          <Route path="/terms" element={<Terms />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRole="user"><Dashboard /></ProtectedRoute>} />
          <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/communities" element={<ProtectedRoute><Communities /></ProtectedRoute>} />
          <Route path="/community/:id" element={<ProtectedRoute><CommunityDetail /></ProtectedRoute>} />
          <Route path="/doctor/search" element={<ProtectedRoute><DoctorSearch /></ProtectedRoute>} />
          <Route path="/appointments-ui" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/medicine" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />
          <Route path="/wellness" element={<ProtectedRoute><Wellness /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
