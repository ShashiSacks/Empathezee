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
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/community/:id" element={<CommunityDetail />} />
          <Route path="/doctor/search" element={<DoctorSearch />} />
          <Route path="/appointments-ui" element={<Appointments />} />
          <Route path="/medicine" element={<Medicines />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<Analytics />} />
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
