
import React from 'react';
import { cn } from '@/lib/utils';

interface MeetingFormLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MeetingFormLayout: React.FC<MeetingFormLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "w-full mx-auto bg-card rounded-xl shadow-lg border",
      "p-6 space-y-8",
      className
    )}>
      {children}
    </div>
  );
};

export default MeetingFormLayout;
