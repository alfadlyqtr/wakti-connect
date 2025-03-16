
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ActiveWorkSessionProps {
  session: any;
}

const ActiveWorkSession: React.FC<ActiveWorkSessionProps> = ({ session }) => {
  if (!session) return null;
  
  return (
    <Card className="bg-muted/50 mb-4">
      <CardContent className="p-4">
        <p className="font-medium">Active Session</p>
        <p className="text-sm text-muted-foreground">
          Started at {new Date(session.start_time).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default ActiveWorkSession;
