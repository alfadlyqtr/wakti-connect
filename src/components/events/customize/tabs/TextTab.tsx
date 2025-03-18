
import React from "react";
import FontSelector from "../FontSelector";
import { EventCustomization } from "@/types/event.types";

interface TextTabProps {
  customization: EventCustomization;
  onFontChange: (property: 'family' | 'size' | 'color', value: string) => void;
}

const TextTab: React.FC<TextTabProps> = ({
  customization,
  onFontChange
}) => {
  return (
    <div className="space-y-4">
      <FontSelector 
        font={customization.font}
        onFontChange={onFontChange}
      />
    </div>
  );
};

export default TextTab;
