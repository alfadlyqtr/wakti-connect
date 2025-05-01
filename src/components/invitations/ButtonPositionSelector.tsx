
import React from 'react';
import { ButtonPosition } from '@/types/invitation.types';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ButtonPositionSelectorProps {
  position: ButtonPosition;
  onPositionChange: (position: ButtonPosition) => void;
}

export default function ButtonPositionSelector({
  position,
  onPositionChange
}: ButtonPositionSelectorProps) {
  const positions: ButtonPosition[] = [
    'bottom-left',
    'bottom-center',
    'bottom-right',
    'top-right'
  ];

  const getPositionLabel = (pos: ButtonPosition): string => {
    switch(pos) {
      case 'bottom-left': return 'Bottom Left';
      case 'bottom-center': return 'Bottom Center';
      case 'bottom-right': return 'Bottom Right';
      case 'top-right': return 'Top Right';
      default: return 'Bottom Center';
    }
  };

  // Helper to render the placeholder buttons in the right position
  const getButtonStyle = (pos: ButtonPosition): string => {
    switch(pos) {
      case 'bottom-left': return 'bottom-0 left-0';
      case 'bottom-center': return 'bottom-0 left-1/2 -translate-x-1/2';
      case 'bottom-right': return 'bottom-0 right-0';
      case 'top-right': return 'top-0 right-0';
      default: return 'bottom-0 left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Button Position</h3>
      <div className="grid grid-cols-2 gap-2">
        {positions.map((pos) => (
          <Card 
            key={pos} 
            className={cn(
              "aspect-video cursor-pointer relative p-2",
              position === pos ? "ring-2 ring-primary" : "hover:bg-muted/50"
            )}
            onClick={() => onPositionChange(pos)}
          >
            {/* Preview of card with button position */}
            <div className="h-full w-full border border-dashed border-muted-foreground/30 rounded relative">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-muted-foreground/30"></div>
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-muted-foreground/30"></div>
              
              {/* Button placeholder */}
              <div className={`absolute ${getButtonStyle(pos)} m-1 h-2 w-8 bg-primary rounded-sm`}></div>
            </div>
            <Label className="mt-1 text-xs block text-center">
              {getPositionLabel(pos)}
            </Label>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Choose where buttons appear on your invitation
      </p>
    </div>
  );
}
