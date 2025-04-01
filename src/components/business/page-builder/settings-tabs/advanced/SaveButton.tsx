
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

interface SaveButtonProps {
  isSaving: boolean;
  isDirty: boolean;
  onClick: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  isSaving,
  isDirty,
  onClick
}) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={isSaving || !isDirty}
    >
      {isSaving ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="w-4 h-4 mr-2" />
          Save Advanced Settings
        </>
      )}
    </Button>
  );
};

export default SaveButton;
