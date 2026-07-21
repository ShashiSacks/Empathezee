import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Activity, Users, Calendar, Video, ArrowRight } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-10 animate-fade-in animate-slide-up">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-primary">Good Morning, Alex 👋</h1>
          <p className="text-secondary-foreground/60 mt-1 text-lg">Welcome to your Empathezee wellness dashboard.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-full"><Users className="w-4 h-4 mr-2" /> Find Community</Button>
          <Button className="rounded-full"><Calendar className="w-4 h-4 mr-2" /> Book Doctor</Button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-semibold text-lg">Wellness Score</h3>
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Activity className="w-5 h-5" /></div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-display font-bold tracking-tighter text-primary">96</span>
            <span className="text-sm text-green-600 font-medium mb-1">↑ 12%</span>
          </div>
        </Card>
        
        <Card>
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-semibold text-lg">Mindfulness Minutes</h3>
            <div className="p-2 bg-secondary rounded-lg"><Activity className="w-5 h-5 text-secondary-foreground" /></div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-display font-bold tracking-tighter">1,240</span>
            <span className="text-sm text-secondary-foreground/60 font-medium mb-1">this week</span>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-semibold text-lg">Current Streak</h3>
            <div className="p-2 bg-accent/10 rounded-lg text-accent"><Activity className="w-5 h-5" /></div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-display font-bold tracking-tighter text-accent">14</span>
            <span className="text-sm text-secondary-foreground/60 font-medium mb-1">days</span>
          </div>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Upcoming Appointments</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            <Card className="flex items-center gap-4 p-4 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-secondary flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold">Dr. Sarah Chen</h4>
                <p className="text-sm text-secondary-foreground/60">Therapist • Virtual</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Today</p>
                <p className="text-sm text-primary font-medium">10:00 AM</p>
              </div>
              <Button size="sm" variant="secondary" className="ml-2 px-3"><Video className="w-4 h-4" /></Button>
            </Card>
            
            <Card className="flex items-center gap-4 p-4 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-secondary flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold">Dr. Mark Davis</h4>
                <p className="text-sm text-secondary-foreground/60">Psychiatrist • In-person</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Oct 29</p>
                <p className="text-sm text-primary font-medium">2:30 PM</p>
              </div>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Your Communities</h2>
            <Button variant="ghost" size="sm">Explore</Button>
          </div>
          <div className="space-y-4">
            <Card className="p-5 hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg">Anxiety Support</h4>
                <ArrowRight className="w-4 h-4 text-secondary-foreground/40 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-secondary-foreground/70 mb-4 line-clamp-2">A safe space to discuss anxiety management techniques, share experiences, and find peer support.</p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-secondary border-2 border-card" />
                  <div className="w-6 h-6 rounded-full bg-secondary border-2 border-card" />
                  <div className="w-6 h-6 rounded-full bg-secondary border-2 border-card" />
                </div>
                <span className="text-xs font-medium text-secondary-foreground/60 ml-1">120 members online</span>
              </div>
            </Card>
            <Card className="p-5 hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg">Mindfulness Journey</h4>
                <ArrowRight className="w-4 h-4 text-secondary-foreground/40 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-secondary-foreground/70 mb-4 line-clamp-2">Daily meditation check-ins, breathing exercises, and philosophical discussions on staying present.</p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-secondary border-2 border-card" />
                  <div className="w-6 h-6 rounded-full bg-secondary border-2 border-card" />
                </div>
                <span className="text-xs font-medium text-secondary-foreground/60 ml-1">85 members online</span>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
