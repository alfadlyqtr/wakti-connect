
import React from 'react';
import { TextPosition } from '@/types/invitation.types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlignStartVertical, AlignCenterVertical, AlignEndVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TextPositionSelectorProps {
  contentPosition: TextPosition;
  spacing: 'compact' | 'normal' | 'spacious';
  onPositionChange: (position: TextPosition) => void;
  onSpacingChange: (spacing: 'compact' | 'normal' | 'spacious') => void;
  // Add this prop to match how it's used in SimpleInvitationCreator
  onChange?: (property: string, value: string) => void;
}

export default function TextPositionSelector({
  contentPosition,
  spacing,
  onPositionChange,
  onSpacingChange,
  onChange
}: TextPositionSelectorProps) {
  // Handle both callback patterns
  const handlePositionChange = (position: TextPosition) => {
    onPositionChange(position);
    if (onChange) onChange('position', position);
  };

  const handleSpacingChange = (spacing: 'compact' | 'normal' | 'spacious') => {
    onSpacingChange(spacing);
    if (onChange) onChange('spacing', spacing);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Text Position</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Position Content</Label>
          <div className="flex justify-center">
            <RadioGroup
              value={contentPosition}
              onValueChange={(value) => handlePositionChange(value as TextPosition)}
              className="flex flex-col gap-2 bg-muted/40 p-3 rounded-lg border"
            >
              <Card className={`p-2 cursor-pointer hover:bg-primary/10 ${contentPosition === 'top' ? 'bg-primary/20 ring-1 ring-primary' : 'bg-card'}`}>
                <div className="flex items-center gap-2">
                  <AlignStartVertical className="h-4 w-4" />
                  <Label htmlFor="position-top" className="cursor-pointer text-sm font-normal">
                    Top
                  </Label>
                  <RadioGroupItem value="top" id="position-top" className="ml-auto" />
                </div>
              </Card>
              
              <Card className={`p-2 cursor-pointer hover:bg-primary/10 ${contentPosition === 'middle' ? 'bg-primary/20 ring-1 ring-primary' : 'bg-card'}`}>
                <div className="flex items-center gap-2">
                  <AlignCenterVertical className="h-4 w-4" />
                  <Label htmlFor="position-middle" className="cursor-pointer text-sm font-normal">
                    Middle
                  </Label>
                  <RadioGroupItem value="middle" id="position-middle" className="ml-auto" />
                </div>
              </Card>
              
              <Card className={`p-2 cursor-pointer hover:bg-primary/10 ${contentPosition === 'bottom' ? 'bg-primary/20 ring-1 ring-primary' : 'bg-card'}`}>
                <div className="flex items-center gap-2">
                  <AlignEndVertical className="h-4 w-4" />
                  <Label htmlFor="position-bottom" className="cursor-pointer text-sm font-normal">
                    Bottom
                  </Label>
                  <RadioGroupItem value="bottom" id="position-bottom" className="ml-auto" />
                </div>
              </Card>
            </RadioGroup>
          </div>
          <div className="pt-2 text-xs text-muted-foreground text-center">
            Select where your text content appears on the card
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="text-spacing" className="text-sm">Content Spacing</Label>
          <Select 
            value={spacing} 
            onValueChange={(value) => handleSpacingChange(value as 'compact' | 'normal' | 'spacious')}
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
          <div className="text-xs text-muted-foreground text-center">
            Adjust spacing between text elements
          </div>
        </div>
      </div>
    </div>
  );
}
