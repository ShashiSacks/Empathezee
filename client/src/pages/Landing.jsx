import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HeartPulse, ShieldCheck, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Landing() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <HeartPulse className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Empathezee</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button className="rounded-full px-6">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now Available for Everyone
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight mb-8 max-w-4xl mx-auto leading-tight">
            Your Personal Space for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Mental Wellness</span>
          </h1>
          
          <p className="text-xl text-secondary-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with certified professionals, join supportive communities, and track your mindfulness journey all in one beautifully designed platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button className="h-14 px-8 text-lg rounded-full w-full sm:w-auto shadow-xl shadow-primary/20 group">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto border-2 border-border hover:bg-secondary/50">
                Book a Therapist
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 hover:-translate-y-1 transition-transform duration-300 bg-card border-none shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Holistic Tracking</h3>
              <p className="text-secondary-foreground/60 leading-relaxed">
                Log your moods, track mindfulness minutes, and maintain streaks to visualize your progress over time.
              </p>
            </Card>

            <Card className="p-8 hover:-translate-y-1 transition-transform duration-300 bg-card border-none shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 text-accent">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Supportive Community</h3>
              <p className="text-secondary-foreground/60 leading-relaxed">
                Join specialized groups for anxiety, depression, and personal growth. You're never alone on this journey.
              </p>
            </Card>

            <Card className="p-8 hover:-translate-y-1 transition-transform duration-300 bg-card border-none shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Experts</h3>
              <p className="text-secondary-foreground/60 leading-relaxed">
                Connect instantly with certified therapists and psychiatrists through our secure virtual telehealth platform.
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 border-t border-border text-center text-secondary-foreground/40 text-sm">
        <p>© 2026 Empathezee. All rights reserved.</p>
      </footer>
    </div>
  );
}
