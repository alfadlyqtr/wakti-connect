
import React from "react";
import { useBusinessPage } from "../context/BusinessPageContext";
import { Button } from "@/components/ui/button";
import { PagePreview } from "./preview/PagePreview";

export const PreviewPanel = () => {
  const { handleSave, saveStatus } = useBusinessPage();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto border rounded-lg bg-white">
        <PagePreview />
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saveStatus === "saved" || saveStatus === "saving"}
          className="min-w-[120px]"
        >
          {saveStatus === "saving" ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
