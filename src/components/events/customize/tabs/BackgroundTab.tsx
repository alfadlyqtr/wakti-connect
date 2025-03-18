
import React from "react";
import BackgroundSelector from "../BackgroundSelector";
import AnimationSelector from "../AnimationSelector";
import { EventCustomization } from "@/types/event.types";

interface BackgroundTabProps {
  customization: EventCustomization;
  onAnimationChange: (value: 'fade' | 'slide' | 'pop') => void;
  onBackgroundChange: (type: 'color' | 'gradient' | 'image', value: string) => void;
}

const BackgroundTab: React.FC<BackgroundTabProps> = ({
  customization,
  onAnimationChange,
  onBackgroundChange
}) => {
  return (
    <div className="space-y-6">
      <BackgroundSelector 
        backgroundType={customization.background.type}
        backgroundValue={customization.background.value}
        onBackgroundChange={onBackgroundChange}
      />

      <AnimationSelector
        value={customization.animation}
        onChange={onAnimationChange}
      />
    </div>
  );
};

export default BackgroundTab;
