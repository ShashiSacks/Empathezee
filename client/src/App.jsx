import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { AuthLayout } from './features/auth/AuthLayout';
import { useAuth } from './features/auth/AuthContext';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthLayout />} />
      
      <Route path="/" element={user ? <AppLayout /> : <Navigate to="/auth" />}>
        <Route index element={<Dashboard />} />
        {/* Placeholder routes for the sidebar links */}
        <Route path="health" element={<div className="p-8"><h1 className="text-3xl font-display font-bold">My Health</h1></div>} />
        <Route path="appointments" element={<div className="p-8"><h1 className="text-3xl font-display font-bold">Appointments</h1></div>} />
        <Route path="community" element={<div className="p-8"><h1 className="text-3xl font-display font-bold">Community</h1></div>} />
        <Route path="messages" element={<div className="p-8"><h1 className="text-3xl font-display font-bold">Messages</h1></div>} />
        <Route path="settings" element={<div className="p-8"><h1 className="text-3xl font-display font-bold">Settings</h1></div>} />
      </Route>
    </Routes>
  );
}

export default App;
