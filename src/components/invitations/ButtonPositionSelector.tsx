
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { ButtonPosition } from '@/types/invitation.types';

interface ButtonConfig {
  show: boolean;
  position: ButtonPosition;
  background: string;
  color: string;
  shape: string;
}

interface ButtonPositionSelectorProps {
  directionsButton?: ButtonConfig;
  calendarButton?: ButtonConfig;
  onChange: (buttonType: string, property: string, value: any) => void;
  showDirections?: boolean;
  showCalendar?: boolean;
  // Add these props to support the way it's used in InvitationStyler
  position?: ButtonPosition;
  onPositionChange?: (position: ButtonPosition) => void;
}

export default function ButtonPositionSelector({
  directionsButton = {
    show: true,
    position: 'bottom-right',
    background: '#3B82F6',
    color: '#ffffff',
    shape: 'rounded'
  },
  calendarButton = {
    show: true,
    position: 'bottom-left',
    background: '#3B82F6',
    color: '#ffffff',
    shape: 'rounded'
  },
  onChange,
  showDirections = false,
  showCalendar = false,
  position,
  onPositionChange
}: ButtonPositionSelectorProps) {
  // If position and onPositionChange are provided, render a simplified version
  if (position && onPositionChange) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Button Position</h3>
        <div>
          <Label className="text-sm text-muted-foreground mb-2 block">Position</Label>
          <RadioGroup
            value={position}
            onValueChange={(value) => onPositionChange(value as ButtonPosition)}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bottom-right" id="pos-bottom-right" />
              <Label htmlFor="pos-bottom-right">Bottom Right</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bottom-left" id="pos-bottom-left" />
              <Label htmlFor="pos-bottom-left">Bottom Left</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bottom-center" id="pos-bottom-center" />
              <Label htmlFor="pos-bottom-center">Bottom Center</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="top-right" id="pos-top-right" />
              <Label htmlFor="pos-top-right">Top Right</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    );
  }

  // Original component implementation
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Button Settings</h3>
      
      {showDirections && (
        <div className="border rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-directions" className="flex-1">Show Directions Button</Label>
            <Switch
              id="show-directions"
              checked={directionsButton.show}
              onCheckedChange={(checked) => onChange('directions', 'show', checked)}
            />
          </div>
          
          {directionsButton.show && (
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Position</Label>
              <RadioGroup
                value={directionsButton.position}
                onValueChange={(value) => onChange('directions', 'position', value)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom-right" id="dir-bottom-right" />
                  <Label htmlFor="dir-bottom-right">Bottom Right</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom-left" id="dir-bottom-left" />
                  <Label htmlFor="dir-bottom-left">Bottom Left</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom-center" id="dir-bottom-center" />
                  <Label htmlFor="dir-bottom-center">Bottom Center</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="top-right" id="dir-top-right" />
                  <Label htmlFor="dir-top-right">Top Right</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>
      )}
      
      {showCalendar && (
        <div className="border rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-calendar" className="flex-1">Show Calendar Button</Label>
            <Switch
              id="show-calendar"
              checked={calendarButton.show}
              onCheckedChange={(checked) => onChange('calendar', 'show', checked)}
            />
          </div>
          
          {calendarButton.show && (
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Position</Label>
              <RadioGroup
                value={calendarButton.position}
                onValueChange={(value) => onChange('calendar', 'position', value)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom-right" id="cal-bottom-right" />
                  <Label htmlFor="cal-bottom-right">Bottom Right</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom-left" id="cal-bottom-left" />
                  <Label htmlFor="cal-bottom-left">Bottom Left</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom-center" id="cal-bottom-center" />
                  <Label htmlFor="cal-bottom-center">Bottom Center</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="top-right" id="cal-top-right" />
                  <Label htmlFor="cal-top-right">Top Right</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
