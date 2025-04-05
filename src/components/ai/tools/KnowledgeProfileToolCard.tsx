
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Book, GraduationCap, Building2, Briefcase, User } from "lucide-react";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { useAISettings } from "@/components/settings/ai/context/AISettingsContext";
import { toast } from "@/components/ui/use-toast";

interface KnowledgeProfileToolCardProps {
  selectedRole: AIAssistantRole;
}

export const KnowledgeProfileToolCard: React.FC<KnowledgeProfileToolCardProps> = ({ selectedRole }) => {
  const { settings, updateSettings } = useAISettings();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Form state for different role-specific fields
  const [studentProfile, setStudentProfile] = useState({
    grade: settings?.knowledge_profile?.grade || "",
    schoolType: settings?.knowledge_profile?.schoolType || "high-school",
    subjects: settings?.knowledge_profile?.subjects || ""
  });
  
  const [businessProfile, setBusinessProfile] = useState({
    industry: settings?.knowledge_profile?.industry || "",
    businessType: settings?.knowledge_profile?.businessType || "service",
    employeeCount: settings?.knowledge_profile?.employeeCount || "1-10"
  });
  
  const [employeeProfile, setEmployeeProfile] = useState({
    field: settings?.knowledge_profile?.field || "",
    experienceLevel: settings?.knowledge_profile?.experienceLevel || "mid-level",
    skills: settings?.knowledge_profile?.skills || ""
  });
  
  const handleSaveProfile = async () => {
    if (!settings) return;
    
    setIsUpdating(true);
    try {
      let knowledgeProfile = {};
      
      switch (selectedRole) {
        case "student":
          knowledgeProfile = studentProfile;
          break;
        case "business_owner":
          knowledgeProfile = businessProfile;
          break;
        case "employee":
          knowledgeProfile = employeeProfile;
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
  
  const getRoleIcon = () => {
    switch (selectedRole) {
      case "student": return <GraduationCap className="h-5 w-5 text-blue-500" />;
      case "business_owner": return <Building2 className="h-5 w-5 text-amber-500" />;
      case "employee": return <Briefcase className="h-5 w-5 text-purple-500" />;
      case "writer": return <Book className="h-5 w-5 text-green-500" />;
      default: return <User className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const renderProfileForm = () => {
    switch (selectedRole) {
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
          </div>
        );
        
      default:
        return (
          <div className="text-center py-2">
            <p className="text-muted-foreground">
              Select a more specific assistant role to customize your knowledge profile.
            </p>
          </div>
        );
    }
  };
  
  return (
    <Card className="shadow-sm hover:shadow transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {getRoleIcon()}
          <CardTitle className="text-lg">Knowledge Profile</CardTitle>
        </div>
        <CardDescription>
          Help your AI assistant understand your context better
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderProfileForm()}
      </CardContent>
      {(selectedRole === "student" || selectedRole === "business_owner" || selectedRole === "employee") && (
        <CardFooter className="flex justify-end pt-0">
          <Button 
            onClick={handleSaveProfile} 
            disabled={isUpdating}
            size="sm"
          >
            {isUpdating ? "Saving..." : "Save Profile"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
