
import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4 border-2';
      case 'md': return 'w-6 h-6 border-2';
      case 'lg': return 'w-10 h-10 border-3';
      case 'xl': return 'w-16 h-16 border-4';
      default: return 'w-6 h-6 border-2';
    }
  };
  
  return (
    <div className={`${getSizeClass()} ${className} rounded-full border-t-transparent border-primary animate-spin`}></div>
  );
};

export default LoadingSpinner;
