
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAISettings } from '@/hooks/ai/settings';
import { AIAssistantRole, KnowledgeProfile } from '@/types/ai-assistant.types';

interface RoleProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRole: AIAssistantRole;
  existingProfile?: KnowledgeProfile;
  onSave: (profile: KnowledgeProfile) => void;
}

const RoleProfileDialog: React.FC<RoleProfileDialogProps> = ({
  open,
  onOpenChange,
  selectedRole,
  existingProfile,
  onSave
}) => {
  // Create an initial profile with the role and default empty values
  const [profile, setProfile] = useState<KnowledgeProfile>({
    role: selectedRole,
    // Student fields
    grade: '',
    schoolType: '',
    subjects: [],
    learningStyle: '',
    goals: [],
    // Business owner fields
    industry: '',
    businessType: '',
    employeeCount: '',
    targetAudience: '',
    challenges: [],
    // Employee fields
    field: '',
    experienceLevel: '',
    skills: [],
    currentProjects: [],
    workStyle: '',
    // Writer fields
    genre: '',
    audience: '',
    style: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const { updateSettings, aiSettings } = useAISettings();

  // Update profile when selected role changes or existing profile is loaded
  useEffect(() => {
    if (existingProfile) {
      setProfile({ ...existingProfile, role: selectedRole });
    } else {
      setProfile({
        role: selectedRole,
        // Reset with empty values for the new role
        grade: '',
        schoolType: '',
        subjects: [],
        learningStyle: '',
        goals: [],
        industry: '',
        businessType: '',
        employeeCount: '',
        targetAudience: '',
        challenges: [],
        field: '',
        experienceLevel: '',
        skills: [],
        currentProjects: [],
        workStyle: '',
        genre: '',
        audience: '',
        style: ''
      });
    }
  }, [selectedRole, existingProfile]);

  // Handle input changes
  const handleChange = (name: string, value: any) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Render fields based on the selected role
  const renderRoleFields = () => {
    switch (selectedRole) {
      case 'student':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grade">Grade/Year</Label>
                <Input
                  id="grade"
                  value={profile.grade || ''}
                  onChange={(e) => handleChange('grade', e.target.value)}
                  placeholder="e.g., 10th Grade, Sophomore"
                />
              </div>
              <div>
                <Label htmlFor="schoolType">School Type</Label>
                <Input
                  id="schoolType"
                  value={profile.schoolType || ''}
                  onChange={(e) => handleChange('schoolType', e.target.value)}
                  placeholder="e.g., High School, University"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="subjects">Subjects</Label>
              <Textarea
                id="subjects"
                value={Array.isArray(profile.subjects) ? profile.subjects.join(', ') : ''}
                onChange={(e) => handleChange('subjects', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Math, Science, History, etc."
              />
            </div>
            <div>
              <Label htmlFor="learningStyle">Learning Style</Label>
              <Input
                id="learningStyle"
                value={profile.learningStyle || ''}
                onChange={(e) => handleChange('learningStyle', e.target.value)}
                placeholder="e.g., Visual, Hands-on, etc."
              />
            </div>
            <div>
              <Label htmlFor="goals">Academic Goals</Label>
              <Textarea
                id="goals"
                value={Array.isArray(profile.goals) ? profile.goals.join(', ') : ''}
                onChange={(e) => handleChange('goals', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Study for SAT, Improve grades, etc."
              />
            </div>
          </div>
        );

      case 'business_owner':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={profile.industry || ''}
                onChange={(e) => handleChange('industry', e.target.value)}
                placeholder="e.g., Retail, Technology, Healthcare"
              />
            </div>
            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Input
                id="businessType"
                value={profile.businessType || ''}
                onChange={(e) => handleChange('businessType', e.target.value)}
                placeholder="e.g., Local Store, Online Service"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeCount">Employee Count</Label>
                <Input
                  id="employeeCount"
                  value={profile.employeeCount || ''}
                  onChange={(e) => handleChange('employeeCount', e.target.value)}
                  placeholder="e.g., 1-10, 11-50"
                />
              </div>
              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  value={profile.targetAudience || ''}
                  onChange={(e) => handleChange('targetAudience', e.target.value)}
                  placeholder="e.g., Millennials, Parents"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="challenges">Business Challenges</Label>
              <Textarea
                id="challenges"
                value={Array.isArray(profile.challenges) ? profile.challenges.join(', ') : ''}
                onChange={(e) => handleChange('challenges', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Marketing, Growth, Operations, etc."
              />
            </div>
          </div>
        );

      case 'employee':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="field">Field/Industry</Label>
                <Input
                  id="field"
                  value={profile.field || ''}
                  onChange={(e) => handleChange('field', e.target.value)}
                  placeholder="e.g., Marketing, Engineering"
                />
              </div>
              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Input
                  id="experienceLevel"
                  value={profile.experienceLevel || ''}
                  onChange={(e) => handleChange('experienceLevel', e.target.value)}
                  placeholder="e.g., Entry-level, Senior"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                value={Array.isArray(profile.skills) ? profile.skills.join(', ') : ''}
                onChange={(e) => handleChange('skills', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Project management, Coding, etc."
              />
            </div>
            <div>
              <Label htmlFor="currentProjects">Current Projects</Label>
              <Textarea
                id="currentProjects"
                value={Array.isArray(profile.currentProjects) ? profile.currentProjects.join(', ') : ''}
                onChange={(e) => handleChange('currentProjects', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Website redesign, Product launch, etc."
              />
            </div>
            <div>
              <Label htmlFor="workStyle">Work Style</Label>
              <Input
                id="workStyle"
                value={profile.workStyle || ''}
                onChange={(e) => handleChange('workStyle', e.target.value)}
                placeholder="e.g., Remote, Collaborative"
              />
            </div>
          </div>
        );

      case 'writer':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={profile.genre || ''}
                  onChange={(e) => handleChange('genre', e.target.value)}
                  placeholder="e.g., Fiction, Technical"
                />
              </div>
              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  value={profile.audience || ''}
                  onChange={(e) => handleChange('audience', e.target.value)}
                  placeholder="e.g., Young Adults, Professionals"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="style">Writing Style</Label>
              <Input
                id="style"
                value={profile.style || ''}
                onChange={(e) => handleChange('style', e.target.value)}
                placeholder="e.g., Formal, Conversational"
              />
            </div>
            <div>
              <Label htmlFor="currentProjects">Current Projects</Label>
              <Textarea
                id="currentProjects"
                value={Array.isArray(profile.currentProjects) ? profile.currentProjects.join(', ') : ''}
                onChange={(e) => handleChange('currentProjects', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Novel, Blog series, etc."
              />
            </div>
            <div>
              <Label htmlFor="goals">Writing Goals</Label>
              <Textarea
                id="goals"
                value={Array.isArray(profile.goals) ? profile.goals.join(', ') : ''}
                onChange={(e) => handleChange('goals', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Publish book, Improve skills, etc."
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Basic profile options are available for this role.
            </p>
          </div>
        );
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Make sure we're passing a valid profile with at least the role property
      onSave({
        ...profile,
        role: selectedRole // Ensure role is always set
      });
      
      // Update AI settings if available
      if (aiSettings) {
        await updateSettings.mutateAsync({
          ...aiSettings,
          knowledge_profile: {
            ...profile,
            role: selectedRole // Ensure role is always set
          }
        });
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Your AI Assistant</DialogTitle>
          <DialogDescription>
            Provide details about your needs to make your assistant more helpful.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto py-4">
          {renderRoleFields()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleProfileDialog;
