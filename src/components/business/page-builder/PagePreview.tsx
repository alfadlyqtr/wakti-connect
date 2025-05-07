
import React from "react";
import { SectionType, PageSettings } from "./simple-builder/types";

export interface PagePreviewProps {
  sections: SectionType[];
  activeSection?: SectionType;
  activeSectionIndex: number | null;
  setActiveSectionIndex: (index: number) => void;
  addSection: (type: string) => void;
  pageSettings: PageSettings;
}

const PagePreview: React.FC<PagePreviewProps> = ({
  sections,
  activeSection,
  activeSectionIndex,
  setActiveSectionIndex,
  addSection,
  pageSettings
}) => {
  // Your implementation here
  return (
    <div>
      {/* This is a simplified version */}
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2">Page Preview</h2>
        <p className="text-gray-600">This component would render a preview of your page.</p>
      </div>
    </div>
  );
};

export default PagePreview;
