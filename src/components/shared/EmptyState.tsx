
import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon, 
  action,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed",
      className
    )}>
      {icon && (
        <div className="mb-4 rounded-full bg-muted p-3">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium">{title}</h3>
      
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
      
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
