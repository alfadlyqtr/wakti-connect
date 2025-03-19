
import React, { useEffect, useState } from "react";

interface TimeElapsedProps {
  startTimeString: string;
}

const TimeElapsed: React.FC<TimeElapsedProps> = ({ startTimeString }) => {
  const [elapsedTime, setElapsedTime] = useState<string>("0:00:00");
  
  useEffect(() => {
    const updateElapsedTime = () => {
      const startTime = new Date(startTimeString);
      const now = new Date();
      
      const diffMillis = now.getTime() - startTime.getTime();
      const hours = Math.floor(diffMillis / (1000 * 60 * 60));
      const minutes = Math.floor((diffMillis % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMillis % (1000 * 60)) / 1000);
      
      setElapsedTime(
        `${hours}h ${minutes.toString().padStart(2, '0')}m`
      );
    };
    
    updateElapsedTime();
    
    const timer = setInterval(updateElapsedTime, 1000);
    return () => clearInterval(timer);
  }, [startTimeString]);
  
  return <span>{elapsedTime}</span>;
};

export default TimeElapsed;
