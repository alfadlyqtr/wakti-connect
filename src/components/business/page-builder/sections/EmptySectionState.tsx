
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptySectionStateProps {
  onAddSection: () => void;
}

const EmptySectionState: React.FC<EmptySectionStateProps> = ({ onAddSection }) => {
  return (
    <div className="text-center py-12 border rounded-lg">
      <p className="text-muted-foreground mb-4">
        You haven't added any sections to your page yet.
      </p>
      <Button onClick={onAddSection}>
        <Plus className="h-4 w-4 mr-2" />
        Add First Section
      </Button>
    </div>
  );
};

export default EmptySectionState;
