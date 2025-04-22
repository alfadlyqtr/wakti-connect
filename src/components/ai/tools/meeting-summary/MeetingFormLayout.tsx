
import React from 'react';
import { cn } from '@/lib/utils';

interface MeetingFormLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MeetingFormLayout: React.FC<MeetingFormLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "w-full max-w-2xl mx-auto",
      "bg-white rounded-lg shadow-lg",
      "border border-wakti-navy/10",
      className
    )}>
      {children}
    </div>
  );
};

export default MeetingFormLayout;
