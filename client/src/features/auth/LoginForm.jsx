import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from '../../components/ui/Button';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';


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
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold mb-2">Welcome Back</h2>
        <p className="text-secondary-foreground/60">Sign in to your account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-start gap-3 text-sm font-medium animate-slide-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-secondary-foreground/80 pl-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground/40" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="you@example.com"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-secondary-foreground/80 pl-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground/40" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex justify-end pb-2">
          <button type="button" className="text-sm font-medium text-primary hover:opacity-80 transition-opacity">
            Forgot password?
          </button>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-lg" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Signing In...</>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>


      <div className="mt-8 text-center text-secondary-foreground/60">
        Don't have an account?{' '}
        <button 
          onClick={onToggleMode}
          className="font-medium text-primary hover:opacity-80 transition-opacity"
        >
          Create one
        </button>
      </div>
    </div>
  );
}
