
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ElementAnimationValue, ElementAnimationDelay, ElementAnimations } from "@/types/event.types";

interface ElementAnimationsSelectorProps {
  value: ElementAnimations;
  onChange: (animations: ElementAnimations) => void;
}

const ElementAnimationsSelector: React.FC<ElementAnimationsSelectorProps> = ({
  value,
  onChange
}) => {
  const handleAnimationChange = (
    key: keyof ElementAnimations, 
    newValue: ElementAnimationValue | ElementAnimationDelay
  ) => {
    onChange({
      ...value,
      [key]: newValue
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Animation Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Text Animation */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Text Animation</h3>
          <RadioGroup 
            value={value.text || 'none'} 
            onValueChange={(val) => handleAnimationChange('text', val as ElementAnimationValue)}
            className="grid grid-cols-4 gap-2"
          >
            <div className="flex flex-col items-center space-y-1">
              <Label 
                htmlFor="text-none" 
                className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent w-full text-center"
              >
                <RadioGroupItem value="none" id="text-none" className="sr-only" />
                None
              </Label>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Label 
                htmlFor="text-fade" 
                className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent w-full text-center"
              >
                <RadioGroupItem value="fade" id="text-fade" className="sr-only" />
                Fade
              </Label>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Label 
                htmlFor="text-slide" 
                className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent w-full text-center"
              >
                <RadioGroupItem value="slide" id="text-slide" className="sr-only" />
                Slide
              </Label>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Label 
                htmlFor="text-pop" 
                className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent w-full text-center"
              >
                <RadioGroupItem value="pop" id="text-pop" className="sr-only" />
                Pop
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Button Animation */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Button Animation</h3>
          <RadioGroup 
            value={value.buttons || 'none'} 
            onValueChange={(val) => handleAnimationChange('buttons', val as ElementAnimationValue)}
            className="grid grid-cols-4 gap-2"
          >
            <div className="flex flex-col items-center space-y-1">
              <Label 
                htmlFor="button-none" 
                className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent w-full text-center"
              >
                <RadioGroupItem value="none" id="button-none" className="sr-only" />
                None
              </Label>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Label 
                htmlFor="button-fade" 
                className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent w-full text-center"
              >
                <RadioGroupItem value="fade" id="button-fade" className="sr-only" />
                Fade
              </Label>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Label 
                htmlFor="button-slide" 
                className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent w-full text-center"
              >
                <RadioGroupItem value="slide" id="button-slide" className="sr-only" />
                Slide
              </Label>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Label 
                htmlFor="button-pop" 
                className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent w-full text-center"
              >
                <RadioGroupItem value="pop" id="button-pop" className="sr-only" />
                Pop
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Icon Animation */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Icon Animation</h3>
          <RadioGroup 
            value={value.icons || 'none'} 
            onValueChange={(val) => handleAnimationChange('icons', val as ElementAnimationValue)}
            className="grid grid-cols-4 gap-2"
          >
            <div className="flex flex-col items-center space-y-1">
              <Label 
                htmlFor="icon-none" 
                className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent w-full text-center"
              >
                <RadioGroupItem value="none" id="icon-none" className="sr-only" />
                None
              </Label>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Label 
                htmlFor="icon-fade" 
                className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent w-full text-center"
              >
                <RadioGroupItem value="fade" id="icon-fade" className="sr-only" />
                Fade
              </Label>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Label 
                htmlFor="icon-slide" 
                className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent w-full text-center"
              >
                <RadioGroupItem value="slide" id="icon-slide" className="sr-only" />
                Slide
              </Label>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Label 
                htmlFor="icon-pop" 
                className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent w-full text-center"
              >
                <RadioGroupItem value="pop" id="icon-pop" className="sr-only" />
                Pop
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Delay Type */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Animation Delay</h3>
          <RadioGroup 
            value={value.delay || 'none'} 
            onValueChange={(val) => handleAnimationChange('delay', val as ElementAnimationDelay)}
            className="grid grid-cols-3 gap-2"
          >
            <div className="flex flex-col items-center space-y-1">
              <Label 
                htmlFor="delay-none" 
                className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent w-full text-center"
              >
                <RadioGroupItem value="none" id="delay-none" className="sr-only" />
                None
              </Label>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Label 
                htmlFor="delay-staggered" 
                className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent w-full text-center"
              >
                <RadioGroupItem value="staggered" id="delay-staggered" className="sr-only" />
                Staggered
              </Label>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Label 
                htmlFor="delay-sequence" 
                className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent w-full text-center"
              >
                <RadioGroupItem value="sequence" id="delay-sequence" className="sr-only" />
                Sequence
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElementAnimationsSelector;
