
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

const JobCardsNoAccess: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
        <Lock className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Access to Job Cards</h3>
        <p className="text-muted-foreground max-w-md">
          You don't have permission to view or create job cards. Contact your business admin to request access.
        </p>
      </CardContent>
    </Card>
  );
};

export default JobCardsNoAccess;
