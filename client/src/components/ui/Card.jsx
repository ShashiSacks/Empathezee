import React from 'react';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border bg-card text-secondary-foreground shadow-sm p-6",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";
