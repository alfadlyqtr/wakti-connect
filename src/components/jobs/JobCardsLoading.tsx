
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const JobCardsLoading: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-8 flex justify-center">
        <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
      </CardContent>
    </Card>
  );
};

export default JobCardsLoading;
