import React from 'react';
import { Video, MapPin, Calendar, Clock, MoreVertical } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export function AppointmentCard({ appointment }) {
  const isVirtual = appointment.type === 'virtual';
  
  return (
    <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
      <div className="w-12 h-12 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center">
        {isVirtual ? <Video className="w-5 h-5 text-primary" /> : <MapPin className="w-5 h-5 text-accent" />}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-lg truncate">Dr. {appointment.doctorName}</h4>
        <p className="text-sm text-secondary-foreground/60">{appointment.specialty} • {isVirtual ? 'Virtual Call' : 'In-Person'}</p>
      </div>
      
      <div className="flex items-center gap-6 text-sm">
        <div className="flex flex-col sm:items-end">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4 text-secondary-foreground/40" />
            {appointment.date}
          </div>
          <div className="flex items-center gap-1.5 text-primary font-medium mt-0.5">
            <Clock className="w-4 h-4 opacity-70" />
            {appointment.time}
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2">
          {appointment.status === 'upcoming' && isVirtual && (
            <Button size="sm" className="px-4">Join Call</Button>
          )}
          <Button size="sm" variant="ghost" className="px-2"><MoreVertical className="w-4 h-4" /></Button>
        </div>
      </div>
      
      {/* Mobile Actions */}
      <div className="w-full flex sm:hidden gap-2 mt-2">
        {appointment.status === 'upcoming' && isVirtual && (
          <Button size="sm" className="flex-1">Join Call</Button>
        )}
        <Button size="sm" variant="outline" className="flex-1">Details</Button>
      </div>
    </Card>
  );
}
