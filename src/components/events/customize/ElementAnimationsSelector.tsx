
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ElementAnimationsSelectorProps {
  value: {
    text?: 'fade' | 'slide' | 'pop' | 'none';
    buttons?: 'fade' | 'slide' | 'pop' | 'none';
    icons?: 'fade' | 'slide' | 'pop' | 'none';
    delay?: 'none' | 'staggered' | 'sequence';
  };
  onChange: (value: any) => void;
}

const ElementAnimationsSelector: React.FC<ElementAnimationsSelectorProps> = ({
  value,
  onChange
}) => {
  const handleTextAnimationChange = (animation: 'fade' | 'slide' | 'pop' | 'none') => {
    onChange({
      ...value,
      text: animation
    });
  };

  const handleButtonsAnimationChange = (animation: 'fade' | 'slide' | 'pop' | 'none') => {
    onChange({
      ...value,
      buttons: animation
    });
  };

  const handleIconsAnimationChange = (animation: 'fade' | 'slide' | 'pop' | 'none') => {
    onChange({
      ...value,
      icons: animation
    });
  };

  const handleDelayTypeChange = (delayType: 'none' | 'staggered' | 'sequence') => {
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
          className="flex flex-wrap gap-4"
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

      <div>
        <Label className="block mb-2">Button Animation</Label>
        <RadioGroup 
          value={value.buttons || 'none'} 
          onValueChange={handleButtonsAnimationChange}
          className="flex flex-wrap gap-4"
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

      <div>
        <Label className="block mb-2">Icon Animation</Label>
        <RadioGroup 
          value={value.icons || 'none'} 
          onValueChange={handleIconsAnimationChange}
          className="flex flex-wrap gap-4"
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

      <div>
        <Label htmlFor="delay-type" className="block mb-2">Animation Timing</Label>
        <Select
          value={value.delay || 'none'}
          onValueChange={handleDelayTypeChange}
        >
          <SelectTrigger id="delay-type">
            <SelectValue placeholder="Select timing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All at once</SelectItem>
            <SelectItem value="staggered">Staggered</SelectItem>
            <SelectItem value="sequence">In sequence</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 p-4 border rounded-md">
        <h3 className="text-lg mb-2 font-semibold">Animation Preview:</h3>
        <div className="space-y-4">
          <div className={`p-2 ${value.text === 'fade' ? 'animate-fade-in' : value.text === 'slide' ? 'animate-slide-in' : value.text === 'pop' ? 'animate-scale-in' : ''}`}>
            <p className="text-sm">This is how text will animate.</p>
          </div>
          
          <div className={`flex justify-center ${value.buttons === 'fade' ? 'animate-fade-in' : value.buttons === 'slide' ? 'animate-slide-in' : value.buttons === 'pop' ? 'animate-scale-in' : ''}`}>
            <button className="bg-primary text-white px-3 py-1 rounded-md text-sm">Button Example</button>
          </div>
          
          <div className="flex justify-center">
            <span className={`inline-block p-2 ${value.icons === 'fade' ? 'animate-fade-in' : value.icons === 'slide' ? 'animate-slide-in' : value.icons === 'pop' ? 'animate-scale-in' : ''}`}>
              🔔
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementAnimationsSelector;
