
import React from "react";
import { PageSettings } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ThemeTabProps {
  pageSettings: PageSettings;
  setPageSettings: (settings: PageSettings) => void;
}

const ThemeTab: React.FC<ThemeTabProps> = ({ pageSettings, setPageSettings }) => {
  const updateSettings = (key: string, value: any) => {
    setPageSettings({
      ...pageSettings,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Font Style</h3>
        <Select
          value={pageSettings.fontFamily}
          onValueChange={(value) => updateSettings('fontFamily', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Inter">Inter</SelectItem>
            <SelectItem value="Poppins">Poppins</SelectItem>
            <SelectItem value="Roboto">Roboto</SelectItem>
            <SelectItem value="Open Sans">Open Sans</SelectItem>
            <SelectItem value="Lato">Lato</SelectItem>
            <SelectItem value="Montserrat">Montserrat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Color Scheme</h3>
        <div className="grid grid-cols-3 gap-2">
          <ColorOption color="#8B5CF6" label="Purple" selected={pageSettings.primaryColor === '#8B5CF6'} onClick={() => updateSettings('primaryColor', '#8B5CF6')} />
          <ColorOption color="#06b6d4" label="Cyan" selected={pageSettings.primaryColor === '#06b6d4'} onClick={() => updateSettings('primaryColor', '#06b6d4')} />
          <ColorOption color="#10b981" label="Emerald" selected={pageSettings.primaryColor === '#10b981'} onClick={() => updateSettings('primaryColor', '#10b981')} />
          <ColorOption color="#f59e0b" label="Amber" selected={pageSettings.primaryColor === '#f59e0b'} onClick={() => updateSettings('primaryColor', '#f59e0b')} />
          <ColorOption color="#ef4444" label="Red" selected={pageSettings.primaryColor === '#ef4444'} onClick={() => updateSettings('primaryColor', '#ef4444')} />
          <ColorOption color="#6366f1" label="Indigo" selected={pageSettings.primaryColor === '#6366f1'} onClick={() => updateSettings('primaryColor', '#6366f1')} />
        </div>
        <div className="mt-4">
          <Label htmlFor="custom-color">Custom Color</Label>
          <Input
            id="custom-color"
            type="color"
            value={pageSettings.primaryColor}
            onChange={(e) => updateSettings('primaryColor', e.target.value)}
            className="mt-1 h-10"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Button Style</h3>
        <RadioGroup
          value={pageSettings.theme}
          onValueChange={(value) => updateSettings('theme', value)}
          className="grid grid-cols-2 gap-2"
        >
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <RadioGroupItem value="default" id="theme-default" />
            <Label htmlFor="theme-default">Default</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <RadioGroupItem value="rounded" id="theme-rounded" />
            <Label htmlFor="theme-rounded">Rounded</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <RadioGroupItem value="outline" id="theme-outline" />
            <Label htmlFor="theme-outline">Outline</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <RadioGroupItem value="minimal" id="theme-minimal" />
            <Label htmlFor="theme-minimal">Minimal</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

// Helper component for color selection
const ColorOption: React.FC<{
  color: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}> = ({ color, label, selected, onClick }) => {
  return (
    <button
      className={`flex flex-col items-center justify-center p-2 border rounded-md transition-all ${
        selected ? 'ring-2 ring-offset-2 ring-black' : 'hover:border-gray-400'
      }`}
      onClick={onClick}
    >
      <div
        className="w-6 h-6 rounded-full mb-1"
        style={{ backgroundColor: color }}
      ></div>
      <span className="text-xs">{label}</span>
    </button>
  );
};

export default ThemeTab;
