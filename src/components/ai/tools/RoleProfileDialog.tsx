
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { useAISettings } from "@/components/settings/ai/context/AISettingsContext";
import { Loader2, Save, X } from "lucide-react";

interface RoleProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: AIAssistantRole;
}

export const RoleProfileDialog: React.FC<RoleProfileDialogProps> = ({
  open,
  onOpenChange,
  role,
}) => {
  const { settings, updateSettings } = useAISettings();
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  // Form state for different role-specific fields
  const [studentProfile, setStudentProfile] = useState({
    grade: "",
    schoolType: "high-school",
    subjects: "",
    learningStyle: "",
    goals: ""
  });
  
  const [businessProfile, setBusinessProfile] = useState({
    industry: "",
    businessType: "service",
    employeeCount: "1-10",
    targetAudience: "",
    challenges: ""
  });
  
  const [employeeProfile, setEmployeeProfile] = useState({
    field: "",
    experienceLevel: "mid-level",
    skills: "",
    currentProjects: "",
    workStyle: ""
  });
  
  const [writerProfile, setWriterProfile] = useState({
    genre: "",
    audience: "",
    style: "",
    currentProjects: "",
    goals: ""
  });
  
  // Load existing profile data when dialog opens
  useEffect(() => {
    if (open && settings?.knowledge_profile) {
      const profile = settings.knowledge_profile;
      
      switch (role) {
        case "student":
          setStudentProfile({
            grade: profile.grade || "",
            schoolType: profile.schoolType || "high-school",
            subjects: profile.subjects || "",
            learningStyle: profile.learningStyle || "",
            goals: profile.goals || ""
          });
          break;
        case "business_owner":
          setBusinessProfile({
            industry: profile.industry || "",
            businessType: profile.businessType || "service",
            employeeCount: profile.employeeCount || "1-10",
            targetAudience: profile.targetAudience || "",
            challenges: profile.challenges || ""
          });
          break;
        case "employee":
          setEmployeeProfile({
            field: profile.field || "",
            experienceLevel: profile.experienceLevel || "mid-level",
            skills: profile.skills || "",
            currentProjects: profile.currentProjects || "",
            workStyle: profile.workStyle || ""
          });
          break;
        case "writer":
          setWriterProfile({
            genre: profile.genre || "",
            audience: profile.audience || "",
            style: profile.style || "",
            currentProjects: profile.currentProjects || "",
            goals: profile.goals || ""
          });
          break;
        default:
          break;
      }
    }
  }, [open, settings, role]);

  const handleSaveProfile = async () => {
    if (!settings) return;
    
    setIsUpdating(true);
    try {
      let knowledgeProfile = {};
      
      switch (role) {
        case "student":
          knowledgeProfile = studentProfile;
          break;
        case "business_owner":
          knowledgeProfile = businessProfile;
          break;
        case "employee":
          knowledgeProfile = employeeProfile;
          break;
        case "writer":
          knowledgeProfile = writerProfile;
          break;
        default:
          knowledgeProfile = {}; 
      }
      
      const updatedSettings = {
        ...settings,
        knowledge_profile: knowledgeProfile
      };
      
      const success = await updateSettings(updatedSettings);
      
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your knowledge profile has been successfully updated.",
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error updating knowledge profile:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your knowledge profile.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getRoleTitle = () => {
    switch (role) {
      case "student": return "Student";
      case "business_owner": return "Business";
      case "employee": return "Work";
      case "writer": return "Writer";
      default: return "General";
    }
  };
  
  const renderProfileForm = () => {
    switch (role) {
      case "student":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="grade">Grade/Year</Label>
              <Input 
                id="grade" 
                placeholder="e.g., 10th grade, Freshman" 
                value={studentProfile.grade}
                onChange={(e) => setStudentProfile({...studentProfile, grade: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="schoolType">Education Level</Label>
              <Select 
                value={studentProfile.schoolType}
                onValueChange={(value) => setStudentProfile({...studentProfile, schoolType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elementary">Elementary School</SelectItem>
                  <SelectItem value="middle-school">Middle School</SelectItem>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="college">College/University</SelectItem>
                  <SelectItem value="graduate">Graduate School</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="subjects">Primary Subjects</Label>
              <Input 
                id="subjects" 
                placeholder="e.g., Math, History, Science" 
                value={studentProfile.subjects}
                onChange={(e) => setStudentProfile({...studentProfile, subjects: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="learningStyle">Learning Style</Label>
              <Input 
                id="learningStyle" 
                placeholder="e.g., Visual, Auditory, Hands-on" 
                value={studentProfile.learningStyle}
                onChange={(e) => setStudentProfile({...studentProfile, learningStyle: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="goals">Academic Goals</Label>
              <Textarea 
                id="goals" 
                placeholder="What are your learning objectives?" 
                value={studentProfile.goals}
                onChange={(e) => setStudentProfile({...studentProfile, goals: e.target.value})}
                className="min-h-[80px]"
              />
            </div>
          </div>
        );
        
      case "business_owner":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input 
                id="industry" 
                placeholder="e.g., Technology, Retail, Healthcare" 
                value={businessProfile.industry}
                onChange={(e) => setBusinessProfile({...businessProfile, industry: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Select 
                value={businessProfile.businessType}
                onValueChange={(value) => setBusinessProfile({...businessProfile, businessType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">Service-based</SelectItem>
                  <SelectItem value="product">Product-based</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="online">Online/E-commerce</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="employeeCount">Company Size</Label>
              <Select 
                value={businessProfile.employeeCount}
                onValueChange={(value) => setBusinessProfile({...businessProfile, employeeCount: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="501+">501+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input 
                id="targetAudience" 
                placeholder="Who are your customers?" 
                value={businessProfile.targetAudience}
                onChange={(e) => setBusinessProfile({...businessProfile, targetAudience: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="challenges">Current Challenges</Label>
              <Textarea 
                id="challenges" 
                placeholder="What business challenges are you facing?" 
                value={businessProfile.challenges}
                onChange={(e) => setBusinessProfile({...businessProfile, challenges: e.target.value})}
                className="min-h-[80px]"
              />
            </div>
          </div>
        );
        
      case "employee":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="field">Professional Field</Label>
              <Input 
                id="field" 
                placeholder="e.g., Marketing, Engineering, Finance" 
                value={employeeProfile.field}
                onChange={(e) => setEmployeeProfile({...employeeProfile, field: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select 
                value={employeeProfile.experienceLevel}
                onValueChange={(value) => setEmployeeProfile({...employeeProfile, experienceLevel: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry-level">Entry Level</SelectItem>
                  <SelectItem value="mid-level">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="skills">Key Skills</Label>
              <Input 
                id="skills" 
                placeholder="e.g., Project Management, Data Analysis" 
                value={employeeProfile.skills}
                onChange={(e) => setEmployeeProfile({...employeeProfile, skills: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="currentProjects">Current Projects</Label>
              <Input 
                id="currentProjects" 
                placeholder="What are you working on?" 
                value={employeeProfile.currentProjects}
                onChange={(e) => setEmployeeProfile({...employeeProfile, currentProjects: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="workStyle">Work Style</Label>
              <Textarea 
                id="workStyle" 
                placeholder="How do you prefer to work?" 
                value={employeeProfile.workStyle}
                onChange={(e) => setEmployeeProfile({...employeeProfile, workStyle: e.target.value})}
                className="min-h-[80px]"
              />
            </div>
          </div>
        );
      
      case "writer":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="genre">Primary Genre</Label>
              <Input 
                id="genre" 
                placeholder="e.g., Fiction, Technical, Content Marketing" 
                value={writerProfile.genre}
                onChange={(e) => setWriterProfile({...writerProfile, genre: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="audience">Target Audience</Label>
              <Input 
                id="audience" 
                placeholder="Who do you write for?" 
                value={writerProfile.audience}
                onChange={(e) => setWriterProfile({...writerProfile, audience: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="style">Writing Style</Label>
              <Input 
                id="style" 
                placeholder="e.g., Conversational, Academic, Technical" 
                value={writerProfile.style}
                onChange={(e) => setWriterProfile({...writerProfile, style: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="currentProjects">Current Projects</Label>
              <Input 
                id="currentProjects" 
                placeholder="What are you writing now?" 
                value={writerProfile.currentProjects}
                onChange={(e) => setWriterProfile({...writerProfile, currentProjects: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="goals">Writing Goals</Label>
              <Textarea 
                id="goals" 
                placeholder="What are you trying to achieve with your writing?" 
                value={writerProfile.goals}
                onChange={(e) => setWriterProfile({...writerProfile, goals: e.target.value})}
                className="min-h-[80px]"
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-2">
            <p className="text-muted-foreground">
              General profile settings are not available.
            </p>
          </div>
        );
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getRoleTitle()} Profile</DialogTitle>
        </DialogHeader>
        
        {renderProfileForm()}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
            className="mr-2"
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button 
            onClick={handleSaveProfile} 
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Profile
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
