
import React from "react";
import { Card } from "@/components/ui/card";

interface StaffMembersErrorProps {
  errorMessage: string;
}

const StaffMembersError: React.FC<StaffMembersErrorProps> = ({ errorMessage }) => {
  return (
    <Card className="col-span-full p-8">
      <p className="text-center text-destructive">{errorMessage}</p>
    </Card>
  );
};

export default StaffMembersError;
