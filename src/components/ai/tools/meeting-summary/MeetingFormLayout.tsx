
import React from 'react';
import { cn } from '@/lib/utils';

interface MeetingFormLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MeetingFormLayout: React.FC<MeetingFormLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "max-w-2xl mx-auto",
      "bg-wakti-beige rounded-xl shadow-lg",
      "p-8",
      "border border-wakti-navy/10",
      className
    )}>
      {children}
    </div>
  );
};

export default MeetingFormLayout;
