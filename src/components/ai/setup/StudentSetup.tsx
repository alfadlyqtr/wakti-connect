
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StudentSetupProps {
  onChange: (settings: Record<string, any>) => void;
}

export const StudentSetup: React.FC<StudentSetupProps> = ({ onChange }) => {
  const [settings, setSettings] = useState({
    schoolLevel: "high-school",
    communicationStyle: "casual",
    detailLevel: "balanced",
    subjects: {
      mathematics: true,
      science: true,
      language: false,
      history: false,
      arts: false,
    }
  });

  const handleChange = (field: string, value: any) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    onChange(newSettings);
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    const newSubjects = { ...settings.subjects, [subject]: checked };
    const newSettings = { ...settings, subjects: newSubjects };
    setSettings(newSettings);
    onChange(newSettings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Student Settings</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Tell us about your education to personalize your AI assistant.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="schoolLevel">Education Level</Label>
          <Select 
            value={settings.schoolLevel}
            onValueChange={(value) => handleChange("schoolLevel", value)}
          >
            <SelectTrigger id="schoolLevel">
              <SelectValue placeholder="Select your education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="middle-school">Middle School</SelectItem>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="undergraduate">Undergraduate</SelectItem>
              <SelectItem value="graduate">Graduate School</SelectItem>
              <SelectItem value="continuing-education">Continuing Education</SelectItem>
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
              <RadioGroupItem value="formal" id="formal_student" />
              <Label htmlFor="formal_student" className="cursor-pointer">Formal & Educational</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="casual" id="casual_student" />
              <Label htmlFor="casual_student" className="cursor-pointer">Casual & Friendly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balanced" id="balanced_student" />
              <Label htmlFor="balanced_student" className="cursor-pointer">Balanced</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Explanation Level</Label>
          <RadioGroup 
            value={settings.detailLevel} 
            onValueChange={(value) => handleChange("detailLevel", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="concise" id="concise_student" />
              <Label htmlFor="concise_student" className="cursor-pointer">Brief Explanations</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detailed" id="detailed_student" />
              <Label htmlFor="detailed_student" className="cursor-pointer">Detailed Explanations</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balanced" id="balanced_detail_student" />
              <Label htmlFor="balanced_detail_student" className="cursor-pointer">Balanced</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Primary Subjects</Label>
          <p className="text-sm text-muted-foreground">
            Select the subjects you need the most help with
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mathematics" 
                checked={settings.subjects.mathematics}
                onCheckedChange={(checked) => 
                  handleSubjectChange("mathematics", checked as boolean)
                }
              />
              <Label htmlFor="mathematics" className="cursor-pointer">Mathematics</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="science" 
                checked={settings.subjects.science}
                onCheckedChange={(checked) => 
                  handleSubjectChange("science", checked as boolean)
                }
              />
              <Label htmlFor="science" className="cursor-pointer">Science</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="language" 
                checked={settings.subjects.language}
                onCheckedChange={(checked) => 
                  handleSubjectChange("language", checked as boolean)
                }
              />
              <Label htmlFor="language" className="cursor-pointer">Language & Writing</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="history" 
                checked={settings.subjects.history}
                onCheckedChange={(checked) => 
                  handleSubjectChange("history", checked as boolean)
                }
              />
              <Label htmlFor="history" className="cursor-pointer">History & Social Studies</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="arts" 
                checked={settings.subjects.arts}
                onCheckedChange={(checked) => 
                  handleSubjectChange("arts", checked as boolean)
                }
              />
              <Label htmlFor="arts" className="cursor-pointer">Arts & Music</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
