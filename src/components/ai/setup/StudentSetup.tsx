
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

interface StudentSetupProps {
  onChange: (settings: Record<string, any>) => void;
}

export const StudentSetup: React.FC<StudentSetupProps> = ({ onChange }) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  
  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev => {
      const newSubjects = prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject];
        
      onChange({ subjects: newSubjects });
      return newSubjects;
    });
  };
  
  const handleSchoolLevelChange = (value: string) => {
    onChange({ schoolLevel: value });
  };
  
  const handleLearningStyleChange = (value: string) => {
    onChange({ learningStyle: value });
  };
  
  const handleCommunicationStyleChange = (value: string) => {
    onChange({ communicationStyle: value });
  };
  
  const handleDetailLevelChange = (value: string) => {
    onChange({ detailLevel: value });
  };
  
  const handleGoalsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ educationalGoals: e.target.value });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Personalize Your Student Experience</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Tell us about your educational needs so your AI assistant can better help you with studies.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="school-level">Education Level</Label>
          <Select onValueChange={handleSchoolLevelChange}>
            <SelectTrigger id="school-level">
              <SelectValue placeholder="Select your education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="middle-school">Middle School</SelectItem>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="undergraduate">Undergraduate</SelectItem>
              <SelectItem value="graduate">Graduate / Post-graduate</SelectItem>
              <SelectItem value="self-learning">Self-Learning</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Subjects You Need Help With</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            {["Mathematics", "Science", "History", "English", "Languages", "Computer Science", 
              "Art", "Music", "Economics", "Business", "Engineering", "Other"].map(subject => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox 
                  id={`subject-${subject}`} 
                  checked={selectedSubjects.includes(subject)}
                  onCheckedChange={() => handleSubjectToggle(subject)}
                />
                <label
                  htmlFor={`subject-${subject}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {subject}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="learning-style">Preferred Learning Style</Label>
          <Select onValueChange={handleLearningStyleChange}>
            <SelectTrigger id="learning-style">
              <SelectValue placeholder="How do you learn best?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visual">Visual (learn through seeing)</SelectItem>
              <SelectItem value="auditory">Auditory (learn through hearing)</SelectItem>
              <SelectItem value="reading-writing">Reading/Writing</SelectItem>
              <SelectItem value="hands-on">Hands-on (learning by doing)</SelectItem>
              <SelectItem value="mixed">Mixed/Combination</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="communication-style">Communication Style</Label>
          <Select onValueChange={handleCommunicationStyleChange}>
            <SelectTrigger id="communication-style">
              <SelectValue placeholder="How should the AI talk to you?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal and educational</SelectItem>
              <SelectItem value="casual">Casual and friendly</SelectItem>
              <SelectItem value="concise">Direct and to-the-point</SelectItem>
              <SelectItem value="detailed">Detailed and thorough</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="detail-level">Explanation Detail Level</Label>
          <Select onValueChange={handleDetailLevelChange}>
            <SelectTrigger id="detail-level">
              <SelectValue placeholder="How detailed should explanations be?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Brief summaries</SelectItem>
              <SelectItem value="balanced">Balanced explanations</SelectItem>
              <SelectItem value="detailed">In-depth explanations</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="goals">What are your educational goals?</Label>
          <Textarea 
            id="goals" 
            placeholder="E.g., Improve my math grades, prepare for college applications..."
            className="resize-none"
            rows={3}
            onChange={handleGoalsChange}
          />
        </div>
      </div>
    </div>
  );
};
