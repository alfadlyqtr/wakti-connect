
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface GradientTabProps {
  value: string;
  onChange: (value: string) => void;
  onDirectionChange?: (direction: string) => void;
  onAngleChange?: (angle: number) => void;
  direction?: string;
  angle?: number;
}

const GradientTab: React.FC<GradientTabProps> = ({ 
  value, 
  onChange,
  onDirectionChange,
  onAngleChange,
  direction = 'to-right',
  angle = 90
}) => {
  const [useCustomAngle, setUseCustomAngle] = useState(false);

  const handleDirectionClick = (dir: string) => {
    if (onDirectionChange) {
      onDirectionChange(dir);
    }
  };

  const handleAngleChange = (newAngle: number[]) => {
    if (onAngleChange) {
      onAngleChange(newAngle[0]);
    }
  };

  return (
    <div className="space-y-6">
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
        className="grid grid-cols-2 gap-2"
      >
        <div>
          <RadioGroupItem value="linear-gradient(90deg, #f6d365 0%, #fda085 100%)" id="gradient1" className="sr-only" />
          <Label htmlFor="gradient1" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
            <div className="w-full h-full" style={{ background: "linear-gradient(90deg, #f6d365 0%, #fda085 100%)" }}></div>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)" id="gradient2" className="sr-only" />
          <Label htmlFor="gradient2" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
            <div className="w-full h-full" style={{ background: "linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)" }}></div>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="linear-gradient(90deg, #d4fc79 0%, #96e6a1 100%)" id="gradient3" className="sr-only" />
          <Label htmlFor="gradient3" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
            <div className="w-full h-full" style={{ background: "linear-gradient(90deg, #d4fc79 0%, #96e6a1 100%)" }}></div>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%)" id="gradient4" className="sr-only" />
          <Label htmlFor="gradient4" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
            <div className="w-full h-full" style={{ background: "linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%)" }}></div>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)" id="gradient5" className="sr-only" />
          <Label htmlFor="gradient5" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
            <div className="w-full h-full" style={{ background: "linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)" }}></div>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)" id="gradient6" className="sr-only" />
          <Label htmlFor="gradient6" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
            <div className="w-full h-full" style={{ background: "linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)" }}></div>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)" id="gradient7" className="sr-only" />
          <Label htmlFor="gradient7" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
            <div className="w-full h-full" style={{ background: "linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)" }}></div>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)" id="gradient8" className="sr-only" />
          <Label htmlFor="gradient8" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
            <div className="w-full h-full" style={{ background: "linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)" }}></div>
          </Label>
        </div>

        {/* Additional gradients */}
        <div>
          <RadioGroupItem value="linear-gradient(90deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)" id="gradient9" className="sr-only" />
          <Label htmlFor="gradient9" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
            <div className="w-full h-full" style={{ background: "linear-gradient(90deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)" }}></div>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="linear-gradient(90deg, #ee9ca7 0%, #ffdde1 100%)" id="gradient10" className="sr-only" />
          <Label htmlFor="gradient10" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
            <div className="w-full h-full" style={{ background: "linear-gradient(90deg, #ee9ca7 0%, #ffdde1 100%)" }}></div>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="linear-gradient(90deg, #d299c2 0%, #fef9d7 100%)" id="gradient11" className="sr-only" />
          <Label htmlFor="gradient11" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
            <div className="w-full h-full" style={{ background: "linear-gradient(90deg, #d299c2 0%, #fef9d7 100%)" }}></div>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="linear-gradient(90deg, #accbee 0%, #e7f0fd 100%)" id="gradient12" className="sr-only" />
          <Label htmlFor="gradient12" className="cursor-pointer h-12 rounded-md block overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
            <div className="w-full h-full" style={{ background: "linear-gradient(90deg, #accbee 0%, #e7f0fd 100%)" }}></div>
          </Label>
        </div>
      </RadioGroup>

      <div className="space-y-4">
        <Label className="block">Gradient Direction</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant={direction === 'to-top-left' ? "default" : "outline"}
            size="sm"
            onClick={() => handleDirectionClick('to-top-left')}
            className="p-2 flex items-center justify-center"
          >
            ↖️
          </Button>
          <Button 
            variant={direction === 'to-top' ? "default" : "outline"}
            size="sm"
            onClick={() => handleDirectionClick('to-top')}
            className="p-2 flex items-center justify-center"
          >
            ⬆️
          </Button>
          <Button 
            variant={direction === 'to-top-right' ? "default" : "outline"}
            size="sm"
            onClick={() => handleDirectionClick('to-top-right')}
            className="p-2 flex items-center justify-center"
          >
            ↗️
          </Button>
          <Button 
            variant={direction === 'to-left' ? "default" : "outline"}
            size="sm"
            onClick={() => handleDirectionClick('to-left')}
            className="p-2 flex items-center justify-center"
          >
            ⬅️
          </Button>
          <Button 
            variant="outline"
            size="sm"
            disabled
            className="p-2 flex items-center justify-center"
          >
            🔄
          </Button>
          <Button 
            variant={direction === 'to-right' ? "default" : "outline"}
            size="sm"
            onClick={() => handleDirectionClick('to-right')}
            className="p-2 flex items-center justify-center"
          >
            ➡️
          </Button>
          <Button 
            variant={direction === 'to-bottom-left' ? "default" : "outline"}
            size="sm"
            onClick={() => handleDirectionClick('to-bottom-left')}
            className="p-2 flex items-center justify-center"
          >
            ↙️
          </Button>
          <Button 
            variant={direction === 'to-bottom' ? "default" : "outline"}
            size="sm"
            onClick={() => handleDirectionClick('to-bottom')}
            className="p-2 flex items-center justify-center"
          >
            ⬇️
          </Button>
          <Button 
            variant={direction === 'to-bottom-right' ? "default" : "outline"}
            size="sm"
            onClick={() => handleDirectionClick('to-bottom-right')}
            className="p-2 flex items-center justify-center"
          >
            ↘️
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="custom-angle">Custom Angle: {angle}°</Label>
          <Switch 
            id="custom-angle-toggle"
            checked={useCustomAngle}
            onCheckedChange={setUseCustomAngle}
          />
        </div>
        
        {useCustomAngle && (
          <Slider
            id="custom-angle"
            value={[angle]}
            min={0}
            max={360}
            step={1}
            onValueChange={handleAngleChange}
          />
        )}
      </div>
    </div>
  );
};

export default GradientTab;
