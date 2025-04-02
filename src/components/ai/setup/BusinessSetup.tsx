
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface BusinessSetupProps {
  onChange: (settings: Record<string, any>) => void;
}

export const BusinessSetup: React.FC<BusinessSetupProps> = ({ onChange }) => {
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  
  const handlePriorityToggle = (priority: string) => {
    setSelectedPriorities(prev => {
      const newPriorities = prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority];
        
      onChange({ businessPriorities: newPriorities });
      return newPriorities;
    });
  };
  
  const handleBusinessTypeChange = (value: string) => {
    onChange({ businessType: value });
  };
  
  const handleBusinessSizeChange = (value: string) => {
    onChange({ businessSize: value });
  };
  
  const handleCommunicationStyleChange = (value: string) => {
    onChange({ communicationStyle: value });
  };
  
  const handleDetailLevelChange = (value: string) => {
    onChange({ detailLevel: value });
  };
  
  const handleGoalsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ businessGoals: e.target.value });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Customize Your Business Assistant</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Tell us about your business so your AI assistant can help you manage operations more effectively.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="business-type">Business Type</Label>
          <Select onValueChange={handleBusinessTypeChange}>
            <SelectTrigger id="business-type">
              <SelectValue placeholder="Select your business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="service">Service Business</SelectItem>
              <SelectItem value="restaurant">Restaurant/Food Service</SelectItem>
              <SelectItem value="professional">Professional Services</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="technology">Technology/Software</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="business-size">Business Size</Label>
          <Select onValueChange={handleBusinessSizeChange}>
            <SelectTrigger id="business-size">
              <SelectValue placeholder="How large is your business?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solo">Solo Entrepreneur</SelectItem>
              <SelectItem value="micro">Micro (2-9 employees)</SelectItem>
              <SelectItem value="small">Small (10-49 employees)</SelectItem>
              <SelectItem value="medium">Medium (50-249 employees)</SelectItem>
              <SelectItem value="large">Large (250+ employees)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Business Priorities</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {["Customer Management", "Staff Coordination", "Marketing", "Sales", 
              "Appointments & Scheduling", "Inventory Management", "Financial Management", 
              "Business Planning", "Growth Strategy", "Operations", "Service Quality", "Other"].map(priority => (
              <div key={priority} className="flex items-center space-x-2">
                <Checkbox 
                  id={`priority-${priority}`} 
                  checked={selectedPriorities.includes(priority)}
                  onCheckedChange={() => handlePriorityToggle(priority)}
                />
                <label
                  htmlFor={`priority-${priority}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {priority}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="communication-style">Communication Style</Label>
          <Select onValueChange={handleCommunicationStyleChange}>
            <SelectTrigger id="communication-style">
              <SelectValue placeholder="How should the AI communicate?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal and professional</SelectItem>
              <SelectItem value="casual">Casual and conversational</SelectItem>
              <SelectItem value="concise">Direct and to-the-point</SelectItem>
              <SelectItem value="detailed">Detailed and thorough</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="detail-level">Information Detail Level</Label>
          <Select onValueChange={handleDetailLevelChange}>
            <SelectTrigger id="detail-level">
              <SelectValue placeholder="How detailed should responses be?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Brief summaries</SelectItem>
              <SelectItem value="balanced">Balanced details</SelectItem>
              <SelectItem value="detailed">In-depth information</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="goals">What are your key business goals?</Label>
          <Textarea 
            id="goals" 
            placeholder="E.g., Increase customer retention, streamline operations, expand services..."
            className="resize-none"
            rows={3}
            onChange={handleGoalsChange}
          />
        </div>
      </div>
    </div>
  );
};
