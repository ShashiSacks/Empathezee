import React from 'react';
import { Star, Clock } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export function DoctorCard({ doctor }) {
  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer group flex flex-col h-full">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex-shrink-0 overflow-hidden">
          {doctor.avatar ? (
            <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-display font-bold text-secondary-foreground">
              {doctor.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-lg">{doctor.name}</h4>
          <p className="text-sm text-secondary-foreground/60">{doctor.specialty}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{doctor.rating}</span>
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <div className="flex items-center gap-2 text-sm text-secondary-foreground/60 mb-4 bg-secondary/30 p-2 rounded-lg">
          <Clock className="w-4 h-4 text-primary" />
          <span>Next available: <span className="font-medium text-secondary-foreground">{doctor.nextAvailable}</span></span>
        </div>
        <Button className="w-full group-hover:bg-primary/90 transition-colors">Book Consultation</Button>
      </div>
    </Card>
  );
}
