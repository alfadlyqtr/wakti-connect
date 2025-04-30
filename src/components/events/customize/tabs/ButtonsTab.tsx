
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ColorPickerInput } from "../inputs/ColorPickerInput";
import { ButtonShape } from "@/types/event.types";
import { Switch } from "@/components/ui/switch";

interface ButtonsTabProps {
  acceptButton: {
    background: string;
    color: string;
    shape: ButtonShape;
    text?: string;
  };
  declineButton: {
    background: string;
    color: string;
    shape: ButtonShape;
    text?: string;
    isVisible: boolean;
  };
  buttonsPosition: "left" | "center" | "right" | "spaced";
  showAcceptDeclineButtons: boolean;
  showAddToCalendarButton: boolean;
  
  onButtonChange: (
    type: "accept" | "decline",
    property: "background" | "color" | "shape" | "text",
    value: string
  ) => void;
  onButtonVisibilityChange: (
    type: "accept" | "decline" | "calendar",
    visible: boolean
  ) => void;
  onButtonsPositionChange: (position: "left" | "center" | "right" | "spaced") => void;
}

const buttonShapes: { id: ButtonShape, label: string }[] = [
  { id: "rounded", label: "Rounded" },
  { id: "pill", label: "Pill" },
  { id: "square", label: "Square" },
];

const buttonPositions = [
  { id: "left", label: "Left" },
  { id: "center", label: "Center" },
  { id: "right", label: "Right" },
  { id: "spaced", label: "Spaced" },
];

const ButtonsTab: React.FC<ButtonsTabProps> = ({
  acceptButton,
  declineButton,
  buttonsPosition,
  showAcceptDeclineButtons,
  showAddToCalendarButton,
  onButtonChange,
  onButtonVisibilityChange,
  onButtonsPositionChange,
}) => {
  return (
    <div className="space-y-8">
      {/* Button Visibility */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Button Visibility</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose which buttons to display on your event card
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-accept-decline"
              checked={showAcceptDeclineButtons}
              onCheckedChange={(checked) => {
                onButtonVisibilityChange("accept", checked);
                if (declineButton.isVisible) {
                  onButtonVisibilityChange("decline", checked);
                }
              }}
            />
            <Label htmlFor="show-accept-decline">Show Accept/Decline Buttons</Label>
          </div>
          
          {showAcceptDeclineButtons && (
            <div className="flex items-center space-x-2 ml-6 mt-2">
              <Switch
                id="show-decline"
                checked={declineButton.isVisible}
                onCheckedChange={(checked) => onButtonVisibilityChange("decline", checked)}
              />
              <Label htmlFor="show-decline">Show Decline Button</Label>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Switch
              id="show-calendar"
              checked={showAddToCalendarButton}
              onCheckedChange={(checked) => onButtonVisibilityChange("calendar", checked)}
            />
            <Label htmlFor="show-calendar">Show Add to Calendar Button</Label>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Buttons Position</Label>
          <RadioGroup
            value={buttonsPosition}
            onValueChange={(value) => onButtonsPositionChange(value as "left" | "center" | "right" | "spaced")}
            className="grid grid-cols-2 gap-4"
          >
            {buttonPositions.map((position) => (
              <div key={position.id} className="flex items-center space-x-2">
                <RadioGroupItem value={position.id} id={`position-${position.id}`} />
                <Label htmlFor={`position-${position.id}`}>{position.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      
      {/* Accept Button */}
      {showAcceptDeclineButtons && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Accept Button</h3>
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={acceptButton.text || "Accept"}
              onChange={(e) => onButtonChange("accept", "text", e.target.value)}
              placeholder="Accept"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Background Color</Label>
              <ColorPickerInput
                value={acceptButton.background}
                onChange={(value) => onButtonChange("accept", "background", value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Text Color</Label>
              <ColorPickerInput
                value={acceptButton.color}
                onChange={(value) => onButtonChange("accept", "color", value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Button Shape</Label>
            <RadioGroup
              value={acceptButton.shape}
              onValueChange={(value) => onButtonChange("accept", "shape", value)}
              className="grid grid-cols-3 gap-4"
            >
              {buttonShapes.map((shape) => (
                <div key={shape.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={shape.id} id={`accept-shape-${shape.id}`} />
                  <Label htmlFor={`accept-shape-${shape.id}`}>{shape.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      )}
      
      {/* Decline Button */}
      {showAcceptDeclineButtons && declineButton.isVisible && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Decline Button</h3>
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={declineButton.text || "Decline"}
              onChange={(e) => onButtonChange("decline", "text", e.target.value)}
              placeholder="Decline"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Background Color</Label>
              <ColorPickerInput
                value={declineButton.background}
                onChange={(value) => onButtonChange("decline", "background", value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Text Color</Label>
              <ColorPickerInput
                value={declineButton.color}
                onChange={(value) => onButtonChange("decline", "color", value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Button Shape</Label>
            <RadioGroup
              value={declineButton.shape}
              onValueChange={(value) => onButtonChange("decline", "shape", value)}
              className="grid grid-cols-3 gap-4"
            >
              {buttonShapes.map((shape) => (
                <div key={shape.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={shape.id} id={`decline-shape-${shape.id}`} />
                  <Label htmlFor={`decline-shape-${shape.id}`}>{shape.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonsTab;
