
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ElementAnimationValue, ElementAnimationDelay, ElementAnimations } from "@/types/event.types";

interface ElementAnimationsSelectorProps {
  value: ElementAnimations;
  onChange: (value: ElementAnimations) => void;
}

const ElementAnimationsSelector: React.FC<ElementAnimationsSelectorProps> = ({
  value,
  onChange
}) => {
  const handleTextAnimationChange = (animation: ElementAnimationValue) => {
    onChange({
      ...value,
      text: animation
    });
  };

  const handleButtonsAnimationChange = (animation: ElementAnimationValue) => {
    onChange({
      ...value,
      buttons: animation
    });
  };

  const handleIconsAnimationChange = (animation: ElementAnimationValue) => {
    onChange({
      ...value,
      icons: animation
    });
  };

  const handleDelayTypeChange = (delayType: ElementAnimationDelay) => {
    onChange({
      ...value,
      delay: delayType
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="block mb-2">Text Animation</Label>
        <RadioGroup 
          value={value.text || 'none'} 
          onValueChange={handleTextAnimationChange}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="text-none" />
            <Label htmlFor="text-none">None</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fade" id="text-fade" />
            <Label htmlFor="text-fade">Fade</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="slide" id="text-slide" />
            <Label htmlFor="text-slide">Slide</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pop" id="text-pop" />
            <Label htmlFor="text-pop">Pop</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <Label className="block mb-2">Button Animation</Label>
        <RadioGroup 
          value={value.buttons || 'none'} 
          onValueChange={handleButtonsAnimationChange}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="buttons-none" />
            <Label htmlFor="buttons-none">None</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fade" id="buttons-fade" />
            <Label htmlFor="buttons-fade">Fade</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="slide" id="buttons-slide" />
            <Label htmlFor="buttons-slide">Slide</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pop" id="buttons-pop" />
            <Label htmlFor="buttons-pop">Pop</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <Label className="block mb-2">Icon Animation</Label>
        <RadioGroup 
          value={value.icons || 'none'} 
          onValueChange={handleIconsAnimationChange}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="icons-none" />
            <Label htmlFor="icons-none">None</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fade" id="icons-fade" />
            <Label htmlFor="icons-fade">Fade</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="slide" id="icons-slide" />
            <Label htmlFor="icons-slide">Slide</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pop" id="icons-pop" />
            <Label htmlFor="icons-pop">Pop</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <Label htmlFor="animation-delay" className="block mb-2">Animation Timing</Label>
        <Select
          value={value.delay || 'none'}
          onValueChange={handleDelayTypeChange}
        >
          <SelectTrigger id="animation-delay">
            <SelectValue placeholder="Select timing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All at once</SelectItem>
            <SelectItem value="staggered">Staggered</SelectItem>
            <SelectItem value="sequence">Sequential</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 bg-muted/20 rounded-md mt-4">
        <h3 className="font-medium mb-2">Animation Preview</h3>
        <div className="flex flex-col gap-2">
          <div className="p-2 text-center">
            <span className={value.text === 'fade' ? 'animate-fade-in' : 
                             value.text === 'slide' ? 'animate-slide-in' : 
                             value.text === 'pop' ? 'animate-scale-in' : ''}>
              Text Animation
            </span>
          </div>
          <div className="p-2 text-center">
            <span className={value.icons === 'fade' ? 'animate-fade-in' : 
                             value.icons === 'slide' ? 'animate-slide-in' : 
                             value.icons === 'pop' ? 'animate-scale-in' : ''}>
              🔔 Icon Animation
            </span>
          </div>
          <div className="p-2 text-center">
            <button 
              className={`px-3 py-1 bg-primary text-white rounded-md ${
                value.buttons === 'fade' ? 'animate-fade-in' : 
                value.buttons === 'slide' ? 'animate-slide-in' : 
                value.buttons === 'pop' ? 'animate-scale-in' : ''
              }`}
            >
              Button Animation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementAnimationsSelector;
