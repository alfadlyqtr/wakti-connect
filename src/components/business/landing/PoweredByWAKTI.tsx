
import React from 'react';
import { cn } from '@/lib/utils';

interface PoweredByWAKTIProps {
  position?: 'top' | 'bottom';
}

const PoweredByWAKTI: React.FC<PoweredByWAKTIProps> = ({ position = 'bottom' }) => {
  return (
    <div className={cn(
      "w-full flex justify-center items-center py-2 px-4 text-xs text-muted-foreground opacity-70",
      position === 'top' ? "border-b" : "border-t"
    )}>
      <span className="flex items-center">
        Powered by{' '}
        <a
          href="https://wakti.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-primary hover:underline ml-1 flex items-center"
        >
          WAKTI
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            width="16" 
            height="16" 
            className="ml-1 fill-current"
          >
            <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z" />
          </svg>
        </a>
      </span>
    </div>
  );
};

export default PoweredByWAKTI;
