
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

const StaffMembersLoading: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-center">
        <RefreshCw className="h-5 w-5 animate-spin mr-2" />
        <p>Loading staff members...</p>
      </div>
    </Card>
  );
};

export default StaffMembersLoading;
