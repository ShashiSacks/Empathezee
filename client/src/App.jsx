import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorLogin from './pages/DoctorLogin';
import DoctorRegister from './pages/DoctorRegister';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Profile from './pages/Profile';
import Communities from './pages/Communities';
import CommunityDetails from './pages/CommunityDetails';
import Appointments from './pages/Appointments';
import Medicine from './pages/Medicine';
import Wellness from './pages/Wellness';
import Analytics from './pages/Analytics';
import DoctorSearch from './pages/DoctorSearch';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Wrapper for Users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
  
  return children;
};

// Protected Route Wrapper for Doctors
const DoctorProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/doctor/login" replace />;
  if (user.role !== 'doctor') return <Navigate to="/dashboard" replace />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            
            {/* Auth Routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="doctor/login" element={<DoctorLogin />} />
            <Route path="doctor/register" element={<DoctorRegister />} />
            
            {/* User Protected Routes */}
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="communities" element={<ProtectedRoute><Communities /></ProtectedRoute>} />
            <Route path="community/:id" element={<ProtectedRoute><CommunityDetails /></ProtectedRoute>} />
            <Route path="doctor/search" element={<ProtectedRoute><DoctorSearch /></ProtectedRoute>} />
            <Route path="appointments-ui" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
            <Route path="medicine" element={<ProtectedRoute><Medicine /></ProtectedRoute>} />
            <Route path="wellness" element={<ProtectedRoute><Wellness /></ProtectedRoute>} />
            <Route path="analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Doctor Protected Routes */}
            <Route path="doctor/dashboard" element={<DoctorProtectedRoute><DoctorDashboard /></DoctorProtectedRoute>} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
