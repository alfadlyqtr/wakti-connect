
import React from 'react';
import { TextPosition } from '@/types/invitation.types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlignCenter, AlignTop, AlignBottom } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TextPositionSelectorProps {
  contentPosition: TextPosition;
  spacing: 'compact' | 'normal' | 'spacious';
  onPositionChange: (position: TextPosition) => void;
  onSpacingChange: (spacing: 'compact' | 'normal' | 'spacious') => void;
}

export default function TextPositionSelector({
  contentPosition,
  spacing,
  onPositionChange,
  onSpacingChange
}: TextPositionSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Text Position</h3>
      
      <div className="space-y-2">
        <Label>Vertical Position</Label>
        <RadioGroup
          value={contentPosition}
          onValueChange={(value) => onPositionChange(value as TextPosition)}
          className="flex gap-4"
        >
          <div className="flex flex-col items-center gap-2">
            <Card className="p-2 flex flex-col items-center cursor-pointer relative hover:bg-muted w-20 h-20">
              <AlignTop className="h-6 w-6" />
              <div className="h-8 border-2 border-primary/40 rounded w-full mt-1"></div>
              <RadioGroupItem value="top" id="position-top" className="absolute opacity-0" />
            </Card>
            <Label htmlFor="position-top" className="cursor-pointer">Top</Label>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Card className="p-2 flex flex-col items-center justify-center cursor-pointer relative hover:bg-muted w-20 h-20">
              <div className="h-4 border-2 border-primary/40 rounded w-full"></div>
              <AlignCenter className="h-6 w-6 my-1" />
              <div className="h-4 border-2 border-primary/40 rounded w-full"></div>
              <RadioGroupItem value="middle" id="position-middle" className="absolute opacity-0" />
            </Card>
            <Label htmlFor="position-middle" className="cursor-pointer">Middle</Label>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Card className="p-2 flex flex-col items-center cursor-pointer relative hover:bg-muted w-20 h-20">
              <div className="h-8 border-2 border-primary/40 rounded w-full mb-1"></div>
              <AlignBottom className="h-6 w-6" />
              <RadioGroupItem value="bottom" id="position-bottom" className="absolute opacity-0" />
            </Card>
            <Label htmlFor="position-bottom" className="cursor-pointer">Bottom</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="text-spacing">Content Spacing</Label>
        <Select 
          value={spacing} 
          onValueChange={(value) => onSpacingChange(value as 'compact' | 'normal' | 'spacious')}
        >
          <SelectTrigger id="text-spacing" className="w-full">
            <SelectValue placeholder="Select spacing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">Compact</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="spacious">Spacious</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
