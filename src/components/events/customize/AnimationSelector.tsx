
import React from "react";
import { Label } from "@/components/ui/label";

interface AnimationSelectorProps {
  value: 'fade' | 'slide' | 'pop' | undefined;
  onChange: (value: 'fade' | 'slide' | 'pop') => void;
}

const AnimationSelector: React.FC<AnimationSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-base">Animation Style</Label>
      
      <div className="grid grid-cols-3 gap-3">
        {['fade', 'slide', 'pop'].map((animation) => (
          <div 
            key={animation}
            className={`border p-2 rounded-md cursor-pointer transition-all ${
              value === animation ? 'border-primary shadow-sm' : 'border-border'
            }`}
            onClick={() => onChange(animation as 'fade' | 'slide' | 'pop')}
          >
            <div className={`aspect-video bg-muted/50 flex items-center justify-center text-sm font-medium capitalize ${
              animation === 'fade' ? 'animate-fade-in' :
              animation === 'slide' ? 'animate-slide-in-right' :
              animation === 'pop' ? 'animate-scale-in' : ''
            }`}>
              {animation}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground mt-1">
        Choose how your event card will animate when it appears on screen.
      </p>
    </div>
  );
};

export default AnimationSelector;
