
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export const EmptyStaffState: React.FC = () => {
  return (
    <Card className="text-center py-8">
      <CardContent className="pt-6">
        <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Staff Members Yet</h3>
        <p className="text-muted-foreground mb-6">
          Add staff members to track their work logs and assign them to services.
        </p>
        <Button asChild>
          <Link to="/dashboard/team">
            <UserPlus className="mr-2 h-4 w-4" />
            Manage Staff
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
