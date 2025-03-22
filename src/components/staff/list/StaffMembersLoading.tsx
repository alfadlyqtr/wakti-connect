
import React from "react";
import { Card } from "@/components/ui/card";

const StaffMembersLoading: React.FC = () => {
  return (
    <Card className="col-span-full flex justify-center p-8">
      <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
    </Card>
  );
};

export default StaffMembersLoading;
