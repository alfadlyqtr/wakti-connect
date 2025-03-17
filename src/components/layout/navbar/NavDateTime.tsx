
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface NavDateTimeProps {
  className?: string;
}

const NavDateTime: React.FC<NavDateTimeProps> = ({ className }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  // Update the time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  const formattedDate = format(currentDateTime, 'EEE, MMM d, yyyy');
  const formattedTime = format(currentDateTime, 'h:mm a');
  
  return (
    <div className={cn("hidden md:flex items-center gap-2 text-muted-foreground", className)}>
      <Clock className="h-4 w-4" />
      <div className="flex flex-col text-xs leading-tight">
        <span>{formattedTime}</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default NavDateTime;
