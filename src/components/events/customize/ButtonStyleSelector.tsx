
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ButtonStyleProps {
  acceptButton: {
    background: string;
    color: string;
    shape: 'rounded' | 'pill' | 'square';
  };
  declineButton: {
    background: string;
    color: string;
    shape: 'rounded' | 'pill' | 'square';
  };
  onButtonStyleChange: (type: 'accept' | 'decline', property: 'background' | 'color' | 'shape', value: string) => void;
}

const ButtonStyleSelector: React.FC<ButtonStyleProps> = ({
  acceptButton,
  declineButton,
  onButtonStyleChange
}) => {
  const getButtonClass = (type: 'accept' | 'decline', shape: string) => {
    const button = type === 'accept' ? acceptButton : declineButton;
    const baseClass = "py-2 px-4 inline-flex items-center gap-1 text-sm font-medium transition-colors";
    const shapeClass = 
      shape === 'rounded' ? "rounded-md" : 
      shape === 'pill' ? "rounded-full" : 
      "rounded-none"; // square
    
    return `${baseClass} ${shapeClass}`;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="block mb-2">Accept Button</Label>
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <Input 
              type="color" 
              value={acceptButton.background} 
              onChange={(e) => onButtonStyleChange('accept', 'background', e.target.value)} 
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Label className="w-24">Background</Label>
          </div>
          
          <div className="flex gap-2 items-center">
            <Input 
              type="color" 
              value={acceptButton.color} 
              onChange={(e) => onButtonStyleChange('accept', 'color', e.target.value)} 
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Label className="w-24">Text Color</Label>
          </div>
          
          <div>
            <Label className="block mb-2">Shape</Label>
            <RadioGroup 
              value={acceptButton.shape} 
              onValueChange={(value) => onButtonStyleChange('accept', 'shape', value as 'rounded' | 'pill' | 'square')}
              className="flex gap-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="rounded" id="accept-rounded" />
                <Label htmlFor="accept-rounded">Rounded</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="pill" id="accept-pill" />
                <Label htmlFor="accept-pill">Pill</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="square" id="accept-square" />
                <Label htmlFor="accept-square">Square</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="mt-2">
            <Label className="block mb-2">Preview:</Label>
            <button
              style={{ backgroundColor: acceptButton.background, color: acceptButton.color }}
              className={getButtonClass('accept', acceptButton.shape)}
            >
              <Check className="w-4 h-4" /> Accept
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <Label className="block mb-2">Decline Button</Label>
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <Input 
              type="color" 
              value={declineButton.background} 
              onChange={(e) => onButtonStyleChange('decline', 'background', e.target.value)} 
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Label className="w-24">Background</Label>
          </div>
          
          <div className="flex gap-2 items-center">
            <Input 
              type="color" 
              value={declineButton.color} 
              onChange={(e) => onButtonStyleChange('decline', 'color', e.target.value)} 
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Label className="w-24">Text Color</Label>
          </div>
          
          <div>
            <Label className="block mb-2">Shape</Label>
            <RadioGroup 
              value={declineButton.shape} 
              onValueChange={(value) => onButtonStyleChange('decline', 'shape', value as 'rounded' | 'pill' | 'square')}
              className="flex gap-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="rounded" id="decline-rounded" />
                <Label htmlFor="decline-rounded">Rounded</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="pill" id="decline-pill" />
                <Label htmlFor="decline-pill">Pill</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="square" id="decline-square" />
                <Label htmlFor="decline-square">Square</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="mt-2">
            <Label className="block mb-2">Preview:</Label>
            <button
              style={{ backgroundColor: declineButton.background, color: declineButton.color }}
              className={getButtonClass('decline', declineButton.shape)}
            >
              <X className="w-4 h-4" /> Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonStyleSelector;
