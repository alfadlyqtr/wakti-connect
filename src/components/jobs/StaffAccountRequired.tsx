
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileX } from "lucide-react";

const StaffAccountRequired: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <FileX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Staff Account Required</h3>
        <p className="text-muted-foreground mb-4">
          You need to be registered as staff to access job cards.
        </p>
      </CardContent>
    </Card>
  );
};

export default StaffAccountRequired;
