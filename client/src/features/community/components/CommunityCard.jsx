import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export function CommunityCard({ community, isJoined = false }) {
  return (
    <Card className="flex flex-col h-full group hover:border-primary/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-lg">{community.name}</h4>
        {isJoined && (
          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">Joined</span>
        )}
      </div>
      <p className="text-sm text-secondary-foreground/70 mb-6 flex-1 line-clamp-3">
        {community.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {community.tags.map(tag => (
          <span key={tag} className="text-xs font-medium bg-secondary px-2 py-1 rounded-md text-secondary-foreground/70">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t">
        <div className="flex items-center gap-1.5 text-sm text-secondary-foreground/60 font-medium">
          <Users className="w-4 h-4" />
          {community.memberCount.toLocaleString()} members
        </div>
        <Button variant={isJoined ? "ghost" : "secondary"} size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {isJoined ? 'Enter' : 'Join Group'} <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </Card>
  );
}
