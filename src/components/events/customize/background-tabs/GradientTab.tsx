
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [startColor, setStartColor] = useState("#f6d365");
  const [endColor, setEndColor] = useState("#fda085");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customMode, setCustomMode] = useState<'direction' | 'angle'>('direction');

  // Preset gradients
  const gradientPresets = [
    { name: "Sunset", value: "linear-gradient(90deg, #f6d365 0%, #fda085 100%)" },
    { name: "Ocean", value: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)" },
    { name: "Purple", value: "linear-gradient(90deg, #a18cd1 0%, #fbc2eb 100%)" },
    { name: "Forest", value: "linear-gradient(90deg, #56ab2f 0%, #a8e063 100%)" },
    { name: "Cherry", value: "linear-gradient(90deg, #eb3349 0%, #f45c43 100%)" },
    { name: "Sky", value: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" },
    { name: "Sunset", value: "linear-gradient(180deg, #ff7e5f 0%, #feb47b 100%)" },
    { name: "Mint", value: "linear-gradient(to right, #11998e, #38ef7d)" },
    { name: "Royal", value: "linear-gradient(to right, #141e30, #243b55)" },
    { name: "Peach", value: "linear-gradient(to right, #f2994a, #f2c94c)" }
  ];

  // Direction options
  const directions = [
    { label: "→", value: "to-right" },
    { label: "↓", value: "to-bottom" },
    { label: "←", value: "to-left" },
    { label: "↑", value: "to-top" },
    { label: "↘", value: "to-bottom-right" },
    { label: "↙", value: "to-bottom-left" },
    { label: "↗", value: "to-top-right" },
    { label: "↖", value: "to-top-left" }
  ];

  // Update the gradient whenever colors change
  const updateGradient = () => {
    if (customMode === 'direction') {
      const dir = direction.replace('to-', 'to ');
      onChange(`linear-gradient(${dir}, ${startColor}, ${endColor})`);
    } else {
      onChange(`linear-gradient(${angle}deg, ${startColor}, ${endColor})`);
    }
  };

  // Handle start color change
  const handleStartColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartColor(e.target.value);
    setSelectedPreset(null);
    updateGradient();
  };

  // Handle end color change
  const handleEndColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndColor(e.target.value);
    setSelectedPreset(null);
    updateGradient();
  };

  // Handle direction change
  const handleDirectionChange = (newDirection: string) => {
    if (onDirectionChange) {
      onDirectionChange(newDirection);
    }
    
    const dir = newDirection.replace('to-', 'to ');
    onChange(`linear-gradient(${dir}, ${startColor}, ${endColor})`);
  };

  // Handle angle change
  const handleAngleChange = (values: number[]) => {
    const newAngle = values[0];
    if (onAngleChange) {
      onAngleChange(newAngle);
    }
    
    onChange(`linear-gradient(${newAngle}deg, ${startColor}, ${endColor})`);
  };

  // Handle preset selection
  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    onChange(preset);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button 
          variant={selectedPreset ? "outline" : "default"} 
          size="sm"
          onClick={() => setSelectedPreset(null)}
        >
          Custom
        </Button>
        <Button 
          variant={selectedPreset ? "default" : "outline"} 
          size="sm"
          onClick={() => setSelectedPreset(gradientPresets[0].value)}
        >
          Presets
        </Button>
      </div>

      {!selectedPreset ? (
        // Custom gradient controls
        <div className="space-y-4">
          <div>
            <Label className="block mb-2">Mode</Label>
            <RadioGroup 
              value={customMode} 
              onValueChange={(value: 'direction' | 'angle') => setCustomMode(value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="direction" id="direction-mode" />
                <Label htmlFor="direction-mode">Direction</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="angle" id="angle-mode" />
                <Label htmlFor="angle-mode">Angle</Label>
              </div>
            </RadioGroup>
          </div>

          {customMode === 'direction' ? (
            <div>
              <Label className="block mb-2">Direction</Label>
              <div className="grid grid-cols-4 gap-2">
                {directions.map((dir) => (
                  <Button
                    key={dir.value}
                    variant={direction === dir.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDirectionChange(dir.value)}
                    className="h-10 w-10 p-0"
                  >
                    {dir.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between mb-2">
                <Label>Angle: {angle}°</Label>
              </div>
              <Slider
                value={[angle]}
                min={0}
                max={360}
                step={1}
                onValueChange={handleAngleChange}
              />
            </div>
          )}

          <div>
            <Label className="block mb-2">Start Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={startColor}
                onChange={handleStartColorChange}
                className="w-12 h-10 p-1 cursor-pointer rounded-md border"
              />
              <input
                type="text"
                value={startColor}
                onChange={handleStartColorChange}
                className="flex-1 h-10 px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <Label className="block mb-2">End Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={endColor}
                onChange={handleEndColorChange}
                className="w-12 h-10 p-1 cursor-pointer rounded-md border"
              />
              <input
                type="text"
                value={endColor}
                onChange={handleEndColorChange}
                className="flex-1 h-10 px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="mt-4">
            <div 
              className="h-14 rounded-md border"
              style={{ background: customMode === 'direction' 
                ? `linear-gradient(${direction.replace('to-', 'to ')}, ${startColor}, ${endColor})` 
                : `linear-gradient(${angle}deg, ${startColor}, ${endColor})`
              }}
            ></div>
          </div>
        </div>
      ) : (
        // Preset gradients
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {gradientPresets.map((preset) => (
              <div
                key={preset.name}
                className={`h-16 rounded-md border cursor-pointer hover:shadow-md transition-shadow ${
                  selectedPreset === preset.value ? 'ring-2 ring-primary' : ''
                }`}
                style={{ background: preset.value }}
                onClick={() => handlePresetSelect(preset.value)}
              >
                <div className="h-full flex items-end justify-center">
                  <span className="bg-background/60 px-2 py-1 text-xs rounded-t-md">
                    {preset.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GradientTab;
