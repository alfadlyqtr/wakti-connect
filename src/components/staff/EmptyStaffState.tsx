
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export const EmptyStaffState = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center h-[300px]">
        <User className="h-16 w-16 text-muted mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Staff Found</h3>
        <p className="text-muted-foreground mb-4 text-center max-w-md">
          You don't have any staff members added yet. Add staff members to start tracking their work hours.
        </p>
        <Button>Add Staff Member</Button>
      </CardContent>
    </Card>
  );
};
