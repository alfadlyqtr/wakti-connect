
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

interface ProfessionalSetupProps {
  onChange: (settings: Record<string, any>) => void;
}

export const ProfessionalSetup: React.FC<ProfessionalSetupProps> = ({ onChange }) => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  
  const handleAreaToggle = (area: string) => {
    setSelectedAreas(prev => {
      const newAreas = prev.includes(area)
        ? prev.filter(s => s !== area)
        : [...prev, area];
        
      onChange({ workAreas: newAreas });
      return newAreas;
    });
  };
  
  const handleIndustryChange = (value: string) => {
    onChange({ industry: value });
  };
  
  const handleRoleChange = (value: string) => {
    onChange({ jobRole: value });
  };
  
  const handleCommunicationStyleChange = (value: string) => {
    onChange({ communicationStyle: value });
  };
  
  const handleDetailLevelChange = (value: string) => {
    onChange({ detailLevel: value });
  };
  
  const handleGoalsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ professionalGoals: e.target.value });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Personalize Your Professional Experience</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Tell us about your work so your AI assistant can better help you with professional tasks.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Select onValueChange={handleIndustryChange}>
            <SelectTrigger id="industry">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="finance">Finance & Banking</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="services">Professional Services</SelectItem>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="role">Job Role</Label>
          <Select onValueChange={handleRoleChange}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manager">Manager/Director</SelectItem>
              <SelectItem value="executive">Executive/C-Suite</SelectItem>
              <SelectItem value="specialist">Specialist/Associate</SelectItem>
              <SelectItem value="consultant">Consultant</SelectItem>
              <SelectItem value="freelancer">Freelancer</SelectItem>
              <SelectItem value="technical">Technical Professional</SelectItem>
              <SelectItem value="administrative">Administrative Staff</SelectItem>
              <SelectItem value="academic">Academic Professional</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Areas You Need Help With</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {["Task Management", "Project Planning", "Email Management", "Meeting Preparation", 
              "Time Management", "Reports & Documents", "Research", "Data Analysis", 
              "Presentations", "Networking", "Team Coordination", "Other"].map(area => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox 
                  id={`area-${area}`} 
                  checked={selectedAreas.includes(area)}
                  onCheckedChange={() => handleAreaToggle(area)}
                />
                <label
                  htmlFor={`area-${area}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {area}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="communication-style">Communication Style</Label>
          <Select onValueChange={handleCommunicationStyleChange}>
            <SelectTrigger id="communication-style">
              <SelectValue placeholder="How should the AI communicate with you?" />
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
          <Label htmlFor="goals">What are your professional goals?</Label>
          <Textarea 
            id="goals" 
            placeholder="E.g., Improve productivity, advance in my career, develop management skills..."
            className="resize-none"
            rows={3}
            onChange={handleGoalsChange}
          />
        </div>
      </div>
    </div>
  );
};
