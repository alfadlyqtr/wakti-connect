
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BusinessSetupProps {
  onChange: (settings: Record<string, any>) => void;
}

export const BusinessSetup: React.FC<BusinessSetupProps> = ({ onChange }) => {
  const [settings, setSettings] = useState({
    businessType: "retail",
    employeeCount: "1-10",
    communicationStyle: "formal",
    detailLevel: "balanced",
    priorities: {
      customerService: true,
      staffManagement: true,
      scheduling: true,
      analytics: false,
      marketing: false,
    }
  });

  const handleChange = (field: string, value: any) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    onChange(newSettings);
  };

  const handlePriorityChange = (area: string, checked: boolean) => {
    const newPriorities = { ...settings.priorities, [area]: checked };
    const newSettings = { ...settings, priorities: newPriorities };
    setSettings(newSettings);
    onChange(newSettings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Business Settings</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Customize your AI assistant for your business needs.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="businessType">Business Type</Label>
          <Select 
            value={settings.businessType}
            onValueChange={(value) => handleChange("businessType", value)}
          >
            <SelectTrigger id="businessType">
              <SelectValue placeholder="Select your business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="restaurant">Restaurant or Food Service</SelectItem>
              <SelectItem value="professional">Professional Services</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="employeeCount">Number of Employees</Label>
          <Select 
            value={settings.employeeCount}
            onValueChange={(value) => handleChange("employeeCount", value)}
          >
            <SelectTrigger id="employeeCount">
              <SelectValue placeholder="Select employee count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="201+">201+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Communication Style</Label>
          <RadioGroup 
            value={settings.communicationStyle} 
            onValueChange={(value) => handleChange("communicationStyle", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="formal" id="formal_business" />
              <Label htmlFor="formal_business" className="cursor-pointer">Formal & Professional</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="concise" id="concise_business" />
              <Label htmlFor="concise_business" className="cursor-pointer">Concise & Direct</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balanced" id="balanced_business" />
              <Label htmlFor="balanced_business" className="cursor-pointer">Balanced</Label>
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
              <RadioGroupItem value="concise" id="concise_detail" />
              <Label htmlFor="concise_detail" className="cursor-pointer">Concise Reports</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detailed" id="detailed_business" />
              <Label htmlFor="detailed_business" className="cursor-pointer">Detailed Analysis</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balanced" id="balanced_detail_business" />
              <Label htmlFor="balanced_detail_business" className="cursor-pointer">Balanced</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Business Priorities</Label>
          <p className="text-sm text-muted-foreground">
            Select the areas where you want the most assistance
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="customerService" 
                checked={settings.priorities.customerService}
                onCheckedChange={(checked) => 
                  handlePriorityChange("customerService", checked as boolean)
                }
              />
              <Label htmlFor="customerService" className="cursor-pointer">Customer Service</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="staffManagement" 
                checked={settings.priorities.staffManagement}
                onCheckedChange={(checked) => 
                  handlePriorityChange("staffManagement", checked as boolean)
                }
              />
              <Label htmlFor="staffManagement" className="cursor-pointer">Staff Management</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="scheduling" 
                checked={settings.priorities.scheduling}
                onCheckedChange={(checked) => 
                  handlePriorityChange("scheduling", checked as boolean)
                }
              />
              <Label htmlFor="scheduling" className="cursor-pointer">Scheduling & Booking</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="analytics" 
                checked={settings.priorities.analytics}
                onCheckedChange={(checked) => 
                  handlePriorityChange("analytics", checked as boolean)
                }
              />
              <Label htmlFor="analytics" className="cursor-pointer">Business Analytics</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="marketing" 
                checked={settings.priorities.marketing}
                onCheckedChange={(checked) => 
                  handlePriorityChange("marketing", checked as boolean)
                }
              />
              <Label htmlFor="marketing" className="cursor-pointer">Marketing & Promotion</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
