
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface ProfessionalSetupProps {
  onChange: (settings: Record<string, any>) => void;
}

export const ProfessionalSetup: React.FC<ProfessionalSetupProps> = ({ onChange }) => {
  const [settings, setSettings] = useState({
    industry: "",
    communicationStyle: "balanced",
    detailLevel: "balanced",
    focusAreas: {
      timeManagement: true,
      emails: true,
      scheduling: true,
      projectPlanning: false,
      research: false,
    }
  });

  const handleChange = (field: string, value: any) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    onChange(newSettings);
  };

  const handleFocusAreaChange = (area: string, checked: boolean) => {
    const newFocusAreas = { ...settings.focusAreas, [area]: checked };
    const newSettings = { ...settings, focusAreas: newFocusAreas };
    setSettings(newSettings);
    onChange(newSettings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Professional Settings</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Tell us more about your work to customize your AI assistant.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="industry">Your Industry or Field</Label>
          <Input 
            id="industry" 
            placeholder="e.g. Marketing, Healthcare, Technology" 
            value={settings.industry}
            onChange={(e) => handleChange("industry", e.target.value)}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Communication Style</Label>
          <RadioGroup 
            value={settings.communicationStyle} 
            onValueChange={(value) => handleChange("communicationStyle", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="formal" id="formal" />
              <Label htmlFor="formal" className="cursor-pointer">Formal & Professional</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="casual" id="casual" />
              <Label htmlFor="casual" className="cursor-pointer">Casual & Conversational</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balanced" id="balanced" />
              <Label htmlFor="balanced" className="cursor-pointer">Balanced</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Detail Level</Label>
          <RadioGroup 
            value={settings.detailLevel} 
            onValueChange={(value) => handleChange("detailLevel", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="concise" id="concise" />
              <Label htmlFor="concise" className="cursor-pointer">Concise & To the Point</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detailed" id="detailed" />
              <Label htmlFor="detailed" className="cursor-pointer">Detailed & Thorough</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balanced" id="balanced_detail" />
              <Label htmlFor="balanced_detail" className="cursor-pointer">Balanced</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Focus Areas</Label>
          <p className="text-sm text-muted-foreground">
            Select the areas where you want the most assistance
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="timeManagement" 
                checked={settings.focusAreas.timeManagement}
                onCheckedChange={(checked) => 
                  handleFocusAreaChange("timeManagement", checked as boolean)
                }
              />
              <Label htmlFor="timeManagement" className="cursor-pointer">Time Management</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="emails" 
                checked={settings.focusAreas.emails}
                onCheckedChange={(checked) => 
                  handleFocusAreaChange("emails", checked as boolean)
                }
              />
              <Label htmlFor="emails" className="cursor-pointer">Email & Communication</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="scheduling" 
                checked={settings.focusAreas.scheduling}
                onCheckedChange={(checked) => 
                  handleFocusAreaChange("scheduling", checked as boolean)
                }
              />
              <Label htmlFor="scheduling" className="cursor-pointer">Scheduling & Calendar</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="projectPlanning" 
                checked={settings.focusAreas.projectPlanning}
                onCheckedChange={(checked) => 
                  handleFocusAreaChange("projectPlanning", checked as boolean)
                }
              />
              <Label htmlFor="projectPlanning" className="cursor-pointer">Project Planning</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="research" 
                checked={settings.focusAreas.research}
                onCheckedChange={(checked) => 
                  handleFocusAreaChange("research", checked as boolean)
                }
              />
              <Label htmlFor="research" className="cursor-pointer">Research & Analysis</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
