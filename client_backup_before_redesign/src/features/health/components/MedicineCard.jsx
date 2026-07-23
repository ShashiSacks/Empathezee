import React, { useState } from 'react';
import { Pill, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

export function MedicineCard({ medicine }) {
  const [isTaken, setIsTaken] = useState(medicine.isTakenToday);
  const [isTaking, setIsTaking] = useState(false);

  const handleTake = async () => {
    setIsTaking(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    setIsTaken(true);
    setIsTaking(false);
  };

  return (
    <Card className={cn(
      "transition-all duration-300",
      isTaken ? "border-green-500/30 bg-green-50/50 dark:bg-green-900/10" : ""
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            isTaken ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-primary/10 text-primary"
          )}>
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h4 className={cn("font-semibold text-lg", isTaken && "text-green-700 dark:text-green-400")}>{medicine.name}</h4>
            <p className="text-sm text-secondary-foreground/60">{medicine.dosage} • {medicine.frequency}</p>
          </div>
        </div>
        
        {isTaken ? (
          <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full text-sm">
            <CheckCircle2 className="w-4 h-4" /> Taken
          </div>
        ) : (
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-sm font-medium text-accent mb-2 justify-end">
              <AlertCircle className="w-4 h-4" /> {medicine.nextDoseTime}
            </div>
            <Button size="sm" onClick={handleTake} disabled={isTaking}>
              {isTaking ? 'Logging...' : 'Mark Taken'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
