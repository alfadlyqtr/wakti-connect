
import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const StaffNotFound: React.FC = () => {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-medium">Staff not found</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          The staff member you're looking for could not be found. They may have been removed or you don't have access.
        </p>
      </div>
    </Card>
  );
};

export default StaffNotFound;
