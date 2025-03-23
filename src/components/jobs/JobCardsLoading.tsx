
import React from "react";
import { Loader2 } from "lucide-react";

const JobCardsLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
      <span>Loading job cards...</span>
    </div>
  );
};

export default JobCardsLoading;
