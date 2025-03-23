
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const StaffNotFound: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <h3 className="text-lg font-medium mb-2">Staff Account Required</h3>
        <p className="text-muted-foreground mb-4">
          You need to be registered as staff to access job cards.
        </p>
      </CardContent>
    </Card>
  );
};

export default StaffNotFound;
