
import React, { useState } from "react";
import { Book } from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAISettings } from "@/components/settings/ai";
import { AIAssistantRole, AIKnowledgeProfile } from "@/types/ai-assistant.types";

interface KnowledgeProfileToolCardProps {
  selectedRole: AIAssistantRole;
}

export const KnowledgeProfileToolCard: React.FC<KnowledgeProfileToolCardProps> = ({ 
  selectedRole 
}) => {
  const { settings, updateSettings } = useAISettings();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<AIKnowledgeProfile>({
    role: selectedRole,
    education_level: settings?.knowledge_profile?.education_level || "",
    school_type: settings?.knowledge_profile?.school_type || "",
    grade: settings?.knowledge_profile?.grade || "",
    business_type: settings?.knowledge_profile?.business_type || "",
    industry: settings?.knowledge_profile?.industry || "",
    job_title: settings?.knowledge_profile?.job_title || "",
    specialization: settings?.knowledge_profile?.specialization || "",
    content_type: settings?.knowledge_profile?.content_type || ""
  });

  const handleChange = (field: keyof AIKnowledgeProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!settings) return;
    
    try {
      await updateSettings.mutateAsync({
        ...settings,
        knowledge_profile: {
          ...formData,
          role: selectedRole
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving knowledge profile:", error);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case 'student':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="education_level">Education Level</Label>
              <Select 
                value={formData.education_level} 
                onValueChange={(value) => handleChange('education_level', value)}
              >
                <SelectTrigger id="education_level">
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary School</SelectItem>
                  <SelectItem value="middle">Middle School</SelectItem>
                  <SelectItem value="high">High School</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="school_type">School Type</Label>
              <Select 
                value={formData.school_type} 
                onValueChange={(value) => handleChange('school_type', value)}
              >
                <SelectTrigger id="school_type">
                  <SelectValue placeholder="Select school type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public School</SelectItem>
                  <SelectItem value="private">Private School</SelectItem>
                  <SelectItem value="international">International School</SelectItem>
                  <SelectItem value="university">University</SelectItem>
                  <SelectItem value="community">Community College</SelectItem>
                  <SelectItem value="online">Online School</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grade">Grade/Year</Label>
              <Input 
                id="grade" 
                value={formData.grade || ''} 
                onChange={(e) => handleChange('grade', e.target.value)} 
                placeholder="Enter your grade or year"
              />
            </div>
          </>
        );
        
      case 'business_owner':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="business_type">Business Type</Label>
              <Select 
                value={formData.business_type} 
                onValueChange={(value) => handleChange('business_type', value)}
              >
                <SelectTrigger id="business_type">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="llc">Limited Liability Company</SelectItem>
                  <SelectItem value="corporation">Corporation</SelectItem>
                  <SelectItem value="nonprofit">Nonprofit</SelectItem>
                  <SelectItem value="freelance">Freelance/Independent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input 
                id="industry" 
                value={formData.industry || ''} 
                onChange={(e) => handleChange('industry', e.target.value)} 
                placeholder="Enter your industry"
              />
            </div>
          </>
        );
        
      case 'professional':
      case 'employee':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Input 
                id="job_title" 
                value={formData.job_title || ''} 
                onChange={(e) => handleChange('job_title', e.target.value)} 
                placeholder="Enter your job title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input 
                id="industry" 
                value={formData.industry || ''} 
                onChange={(e) => handleChange('industry', e.target.value)} 
                placeholder="Enter your industry"
              />
            </div>
          </>
        );
        
      case 'writer':
      case 'creator':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input 
                id="specialization" 
                value={formData.specialization || ''} 
                onChange={(e) => handleChange('specialization', e.target.value)} 
                placeholder="Enter your specialization"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content_type">Content Type</Label>
              <Select 
                value={formData.content_type} 
                onValueChange={(value) => handleChange('content_type', value)}
              >
                <SelectTrigger id="content_type">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog Posts</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="technical">Technical Writing</SelectItem>
                  <SelectItem value="creative">Creative Writing</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <AIToolCard
      icon={Book}
      title="Knowledge Profile"
      description="Help the AI understand your context better"
      iconColor="text-blue-500"
    >
      {!isEditing ? (
        <div className="space-y-4">
          {settings?.knowledge_profile ? (
            <div className="text-sm space-y-2">
              {selectedRole === 'student' && (
                <>
                  {settings.knowledge_profile.education_level && (
                    <p><span className="font-medium">Education Level:</span> {settings.knowledge_profile.education_level}</p>
                  )}
                  {settings.knowledge_profile.school_type && (
                    <p><span className="font-medium">School Type:</span> {settings.knowledge_profile.school_type}</p>
                  )}
                  {settings.knowledge_profile.grade && (
                    <p><span className="font-medium">Grade/Year:</span> {settings.knowledge_profile.grade}</p>
                  )}
                </>
              )}
              
              {selectedRole === 'business_owner' && (
                <>
                  {settings.knowledge_profile.business_type && (
                    <p><span className="font-medium">Business Type:</span> {settings.knowledge_profile.business_type}</p>
                  )}
                  {settings.knowledge_profile.industry && (
                    <p><span className="font-medium">Industry:</span> {settings.knowledge_profile.industry}</p>
                  )}
                </>
              )}
              
              {(selectedRole === 'professional' || selectedRole === 'employee') && (
                <>
                  {settings.knowledge_profile.job_title && (
                    <p><span className="font-medium">Job Title:</span> {settings.knowledge_profile.job_title}</p>
                  )}
                  {settings.knowledge_profile.industry && (
                    <p><span className="font-medium">Industry:</span> {settings.knowledge_profile.industry}</p>
                  )}
                </>
              )}
              
              {(selectedRole === 'writer' || selectedRole === 'creator') && (
                <>
                  {settings.knowledge_profile.specialization && (
                    <p><span className="font-medium">Specialization:</span> {settings.knowledge_profile.specialization}</p>
                  )}
                  {settings.knowledge_profile.content_type && (
                    <p><span className="font-medium">Content Type:</span> {settings.knowledge_profile.content_type}</p>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No profile information available. Add details to help the AI assist you better.</p>
          )}
          
          <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
            {settings?.knowledge_profile ? "Edit Profile" : "Create Profile"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {renderRoleSpecificFields()}
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="default" className="flex-1" onClick={handleSave}>
              Save Profile
            </Button>
          </div>
        </div>
      )}
    </AIToolCard>
  );
};
