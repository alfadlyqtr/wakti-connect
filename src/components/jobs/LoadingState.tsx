
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
      <span className="ml-2">Loading job cards...</span>
    </div>
  );
};

export default LoadingState;
