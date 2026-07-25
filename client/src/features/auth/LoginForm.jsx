import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from '../../components/ui/Button';
import { Mail, Lock, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

export function LoginForm({ onToggleMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto animate-fade-in">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-1.5">Welcome Back</h2>
        <p className="text-sm text-slate-500">Sign in to manage your health and community.</p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-start gap-2.5 text-sm font-medium animate-slide-up">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider pl-0.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="you@example.com"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider pl-0.5">Password</label>
            <button type="button" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              Forgot?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="pt-1">
          <Button 
            type="submit" 
            variant="primary"
            fullWidth
            className="h-11 text-base font-semibold" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing In...</>
            ) : (
              'Sign In'
            )}
          </Button>
        </div>
      </form>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Secure HIPAA-compliant authentication</span>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <button 
          onClick={onToggleMode}
          className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Create account
        </button>
      </div>
    </div>
  );
}
