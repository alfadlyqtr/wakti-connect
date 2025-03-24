
import React from "react";
import { Clock } from "lucide-react";

interface EmptyStateProps {
  message: string;
  subMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, subMessage }) => {
  return (
    <div className="text-center py-8">
      <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{message}</h3>
      {subMessage && <p className="text-muted-foreground">{subMessage}</p>}
    </div>
  );
};

export const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center p-8">
      <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
    </div>
  );
};
