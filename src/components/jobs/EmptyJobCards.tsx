
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

const EmptyJobCards: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Job Cards Yet</h3>
        <p className="text-muted-foreground">
          Start a work session and create your first job card.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyJobCards;
