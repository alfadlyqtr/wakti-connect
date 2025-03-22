
import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center p-6">
      <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
    </div>
  );
};
