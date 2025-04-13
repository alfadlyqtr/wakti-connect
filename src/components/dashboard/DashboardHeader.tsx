
import React from 'react';

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  heading,
  text,
  children,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      {children && <div className="flex-shrink-0">{children}</div>}
    </div>
  );
};
