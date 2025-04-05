
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SchoolBook, Briefcase, GraduationCap, Building2 } from "lucide-react";

interface KnowledgeProfileToolCardProps {
  selectedRole: AIAssistantRole;
}

export const KnowledgeProfileToolCard: React.FC<KnowledgeProfileToolCardProps> = ({ selectedRole }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const getFormFields = () => {
    switch (selectedRole) {
      case 'student':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education_level">Education Level</Label>
                <Select 
                  onValueChange={(value) => handleChange('education_level', value)}
                  value={formData.education_level || ''}
                >
                  <SelectTrigger id="education_level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary School</SelectItem>
                    <SelectItem value="middle">Middle School</SelectItem>
                    <SelectItem value="high">High School</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="graduate">Graduate School</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grade">Grade/Year</Label>
                <Input 
                  id="grade" 
                  placeholder="e.g. 10th Grade, 2nd Year"
                  onChange={(e) => handleChange('grade', e.target.value)}
                  value={formData.grade || ''}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subjects">Main Subjects/Focus Areas</Label>
              <Input 
                id="subjects" 
                placeholder="Math, Science, Literature, etc."
                onChange={(e) => handleChange('subjects', e.target.value)}
                value={formData.subjects || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="learning_style">Learning Style</Label>
              <Select 
                onValueChange={(value) => handleChange('learning_style', value)}
                value={formData.learning_style || ''}
              >
                <SelectTrigger id="learning_style">
                  <SelectValue placeholder="How do you learn best?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual Learner</SelectItem>
                  <SelectItem value="auditory">Auditory Learner</SelectItem>
                  <SelectItem value="reading">Reading/Writing</SelectItem>
                  <SelectItem value="kinesthetic">Kinesthetic (Hands-on)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="academic_goals">Academic Goals</Label>
              <Textarea 
                id="academic_goals" 
                placeholder="What are your current academic goals?"
                onChange={(e) => handleChange('academic_goals', e.target.value)}
                value={formData.academic_goals || ''}
              />
            </div>
          </div>
        );
        
      case 'business_owner':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_type">Business Type</Label>
                <Select 
                  onValueChange={(value) => handleChange('business_type', value)}
                  value={formData.business_type || ''}
                >
                  <SelectTrigger id="business_type">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="hospitality">Hospitality</SelectItem>
                    <SelectItem value="health">Healthcare</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team_size">Team Size</Label>
                <Select 
                  onValueChange={(value) => handleChange('team_size', value)}
                  value={formData.team_size || ''}
                >
                  <SelectTrigger id="team_size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Just Me</SelectItem>
                    <SelectItem value="small">2-5 people</SelectItem>
                    <SelectItem value="medium">6-20 people</SelectItem>
                    <SelectItem value="large">21-100 people</SelectItem>
                    <SelectItem value="enterprise">100+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input 
                id="industry" 
                placeholder="E.g. Automotive, Food Service, Tech"
                onChange={(e) => handleChange('industry', e.target.value)}
                value={formData.industry || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business_goals">Business Goals</Label>
              <Textarea 
                id="business_goals" 
                placeholder="What are your current business priorities?"
                onChange={(e) => handleChange('business_goals', e.target.value)}
                value={formData.business_goals || ''}
              />
            </div>
          </div>
        );
        
      case 'employee':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input 
                  id="job_title" 
                  placeholder="E.g. Software Engineer, Project Manager"
                  onChange={(e) => handleChange('job_title', e.target.value)}
                  value={formData.job_title || ''}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department" 
                  placeholder="E.g. Engineering, HR, Marketing"
                  onChange={(e) => handleChange('department', e.target.value)}
                  value={formData.department || ''}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input 
                id="industry" 
                placeholder="E.g. Healthcare, Financial Services"
                onChange={(e) => handleChange('industry', e.target.value)}
                value={formData.industry || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="primary_responsibilities">Primary Responsibilities</Label>
              <Textarea 
                id="primary_responsibilities" 
                placeholder="What are your main job responsibilities?"
                onChange={(e) => handleChange('primary_responsibilities', e.target.value)}
                value={formData.primary_responsibilities || ''}
              />
            </div>
          </div>
        );
        
      case 'writer':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="writer_type">Writer Type</Label>
                <Select 
                  onValueChange={(value) => handleChange('writer_type', value)}
                  value={formData.writer_type || ''}
                >
                  <SelectTrigger id="writer_type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content">Content Writer</SelectItem>
                    <SelectItem value="creative">Creative Writer</SelectItem>
                    <SelectItem value="academic">Academic Writer</SelectItem>
                    <SelectItem value="journalist">Journalist</SelectItem>
                    <SelectItem value="technical">Technical Writer</SelectItem>
                    <SelectItem value="copywriter">Copywriter</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primary_genre">Primary Genre/Field</Label>
                <Input 
                  id="primary_genre" 
                  placeholder="E.g. Fiction, Technology, Health"
                  onChange={(e) => handleChange('primary_genre', e.target.value)}
                  value={formData.primary_genre || ''}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="writing_style">Writing Style Preferences</Label>
              <Textarea 
                id="writing_style" 
                placeholder="Describe your preferred writing style"
                onChange={(e) => handleChange('writing_style', e.target.value)}
                value={formData.writing_style || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="current_projects">Current Projects</Label>
              <Textarea 
                id="current_projects" 
                placeholder="What are you currently working on?"
                onChange={(e) => handleChange('current_projects', e.target.value)}
                value={formData.current_projects || ''}
              />
            </div>
          </div>
        );
        
      default: // general
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interests">Interests & Hobbies</Label>
              <Input 
                id="interests" 
                placeholder="E.g. Cooking, Photography, Travel"
                onChange={(e) => handleChange('interests', e.target.value)}
                value={formData.interests || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profession">Profession/Field</Label>
              <Input 
                id="profession" 
                placeholder="E.g. Teacher, Designer, Engineer"
                onChange={(e) => handleChange('profession', e.target.value)}
                value={formData.profession || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goals">Current Goals</Label>
              <Textarea 
                id="goals" 
                placeholder="What are you currently working towards?"
                onChange={(e) => handleChange('goals', e.target.value)}
                value={formData.goals || ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferences">Communication Preferences</Label>
              <Select 
                onValueChange={(value) => handleChange('preferences', value)}
                value={formData.preferences || ''}
              >
                <SelectTrigger id="preferences">
                  <SelectValue placeholder="How would you like to communicate?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief & To-the-point</SelectItem>
                  <SelectItem value="detailed">Detailed Explanations</SelectItem>
                  <SelectItem value="friendly">Friendly & Conversational</SelectItem>
                  <SelectItem value="professional">Professional & Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
    }
  };
  
  const getRoleIcon = () => {
    switch(selectedRole) {
      case 'student':
        return <SchoolBook className="h-5 w-5 mr-2" />;
      case 'business_owner':
        return <Briefcase className="h-5 w-5 mr-2" />;
      case 'employee':
        return <Building2 className="h-5 w-5 mr-2" />;
      default:
        return <GraduationCap className="h-5 w-5 mr-2" />;
    }
  };
  
  const getRoleTitle = () => {
    switch(selectedRole) {
      case 'student':
        return 'Student Profile';
      case 'business_owner':
        return 'Business Profile';
      case 'employee':
        return 'Professional Profile';
      case 'writer':
        return 'Writer Profile';
      default:
        return 'Personal Profile';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          {getRoleIcon()}
          {getRoleTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Help WAKTI AI understand your specific needs better by sharing some details about yourself.
          This information helps the AI provide more relevant and personalized assistance.
        </p>
        
        {getFormFields()}
        
        <div className="pt-2">
          <Button className="w-full">
            Save Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
