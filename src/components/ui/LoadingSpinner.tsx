
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'border-wakti-blue'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${color} border-t-transparent rounded-full animate-spin`} 
      role="status" 
      aria-label="Loading"
    />
  );
};

export default LoadingSpinner;
