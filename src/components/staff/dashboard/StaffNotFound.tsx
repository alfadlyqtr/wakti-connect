
import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const StaffNotFound: React.FC = () => {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-medium">Not a Staff Account</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          This dashboard is only available for staff accounts. If you're a staff member, 
          please contact your business administrator.
        </p>
      </div>
    </Card>
  );
};

export default StaffNotFound;
