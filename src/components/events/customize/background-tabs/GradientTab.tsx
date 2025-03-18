
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface GradientTabProps {
  value: string;
  onChange: (value: string) => void;
}

const GradientTab: React.FC<GradientTabProps> = ({ value, onChange }) => {
  return (
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
    </RadioGroup>
  );
};

export default GradientTab;
