
import React from 'react';
import { cn } from '@/lib/utils';

interface MeetingFormLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MeetingFormLayout: React.FC<MeetingFormLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "w-full max-w-3xl mx-auto bg-gradient-to-br from-background to-muted/50 rounded-xl shadow-lg border border-border/50",
      "backdrop-blur-sm p-6 space-y-8",
      className
    )}>
      {children}
    </div>
  );
};

export default MeetingFormLayout;
