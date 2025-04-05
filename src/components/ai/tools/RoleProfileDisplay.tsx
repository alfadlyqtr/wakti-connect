
import React from "react";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoleProfileDisplayProps {
  role: AIAssistantRole;
  profileData: Record<string, any> | undefined;
  onEditClick: () => void;
}

export const RoleProfileDisplay: React.FC<RoleProfileDisplayProps> = ({
  role,
  profileData,
  onEditClick,
}) => {
  if (!profileData || Object.keys(profileData).filter(key => !!profileData[key]).length === 0) {
    return (
      <div className="border rounded-md p-4 bg-muted/20 mb-4 text-center">
        <p className="text-muted-foreground text-sm">No profile information added yet.</p>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onEditClick}
          className="mt-2"
        >
          <Pencil className="h-3.5 w-3.5 mr-1.5" /> Add Profile Info
        </Button>
      </div>
    );
  }

  const renderStudentProfile = () => (
    <div className="space-y-2">
      {profileData.grade && (
        <div>
          <span className="text-muted-foreground text-xs">Grade/Year:</span>
          <p className="text-sm font-medium">{profileData.grade}</p>
        </div>
      )}
      
      {profileData.schoolType && (
        <div>
          <span className="text-muted-foreground text-xs">Education:</span>
          <p className="text-sm font-medium">
            {profileData.schoolType === "elementary" && "Elementary School"}
            {profileData.schoolType === "middle-school" && "Middle School"}
            {profileData.schoolType === "high-school" && "High School"}
            {profileData.schoolType === "college" && "College/University"}
            {profileData.schoolType === "graduate" && "Graduate School"}
          </p>
        </div>
      )}
      
      {profileData.subjects && (
        <div>
          <span className="text-muted-foreground text-xs">Subjects:</span>
          <p className="text-sm font-medium">{profileData.subjects}</p>
        </div>
      )}
      
      {profileData.learningStyle && (
        <div>
          <span className="text-muted-foreground text-xs">Learning Style:</span>
          <p className="text-sm font-medium">{profileData.learningStyle}</p>
        </div>
      )}
      
      {profileData.goals && (
        <div>
          <span className="text-muted-foreground text-xs">Goals:</span>
          <p className="text-sm font-medium">{profileData.goals}</p>
        </div>
      )}
    </div>
  );

  const renderBusinessProfile = () => (
    <div className="space-y-2">
      {profileData.industry && (
        <div>
          <span className="text-muted-foreground text-xs">Industry:</span>
          <p className="text-sm font-medium">{profileData.industry}</p>
        </div>
      )}
      
      {profileData.businessType && (
        <div>
          <span className="text-muted-foreground text-xs">Business Type:</span>
          <p className="text-sm font-medium">
            {profileData.businessType === "service" && "Service-based"}
            {profileData.businessType === "product" && "Product-based"}
            {profileData.businessType === "retail" && "Retail"}
            {profileData.businessType === "online" && "Online/E-commerce"}
            {profileData.businessType === "consulting" && "Consulting"}
          </p>
        </div>
      )}
      
      {profileData.employeeCount && (
        <div>
          <span className="text-muted-foreground text-xs">Company Size:</span>
          <p className="text-sm font-medium">{profileData.employeeCount} employees</p>
        </div>
      )}
      
      {profileData.targetAudience && (
        <div>
          <span className="text-muted-foreground text-xs">Target Audience:</span>
          <p className="text-sm font-medium">{profileData.targetAudience}</p>
        </div>
      )}
      
      {profileData.challenges && (
        <div>
          <span className="text-muted-foreground text-xs">Challenges:</span>
          <p className="text-sm font-medium">{profileData.challenges}</p>
        </div>
      )}
    </div>
  );

  const renderEmployeeProfile = () => (
    <div className="space-y-2">
      {profileData.field && (
        <div>
          <span className="text-muted-foreground text-xs">Field:</span>
          <p className="text-sm font-medium">{profileData.field}</p>
        </div>
      )}
      
      {profileData.experienceLevel && (
        <div>
          <span className="text-muted-foreground text-xs">Experience:</span>
          <p className="text-sm font-medium">
            {profileData.experienceLevel === "entry-level" && "Entry Level"}
            {profileData.experienceLevel === "mid-level" && "Mid Level"}
            {profileData.experienceLevel === "senior" && "Senior"}
            {profileData.experienceLevel === "manager" && "Manager"}
            {profileData.experienceLevel === "executive" && "Executive"}
          </p>
        </div>
      )}
      
      {profileData.skills && (
        <div>
          <span className="text-muted-foreground text-xs">Skills:</span>
          <p className="text-sm font-medium">{profileData.skills}</p>
        </div>
      )}
      
      {profileData.currentProjects && (
        <div>
          <span className="text-muted-foreground text-xs">Current Projects:</span>
          <p className="text-sm font-medium">{profileData.currentProjects}</p>
        </div>
      )}
      
      {profileData.workStyle && (
        <div>
          <span className="text-muted-foreground text-xs">Work Style:</span>
          <p className="text-sm font-medium">{profileData.workStyle}</p>
        </div>
      )}
    </div>
  );

  const renderWriterProfile = () => (
    <div className="space-y-2">
      {profileData.genre && (
        <div>
          <span className="text-muted-foreground text-xs">Genre:</span>
          <p className="text-sm font-medium">{profileData.genre}</p>
        </div>
      )}
      
      {profileData.audience && (
        <div>
          <span className="text-muted-foreground text-xs">Audience:</span>
          <p className="text-sm font-medium">{profileData.audience}</p>
        </div>
      )}
      
      {profileData.style && (
        <div>
          <span className="text-muted-foreground text-xs">Writing Style:</span>
          <p className="text-sm font-medium">{profileData.style}</p>
        </div>
      )}
      
      {profileData.currentProjects && (
        <div>
          <span className="text-muted-foreground text-xs">Current Projects:</span>
          <p className="text-sm font-medium">{profileData.currentProjects}</p>
        </div>
      )}
      
      {profileData.goals && (
        <div>
          <span className="text-muted-foreground text-xs">Goals:</span>
          <p className="text-sm font-medium">{profileData.goals}</p>
        </div>
      )}
    </div>
  );

  const renderProfileContent = () => {
    switch (role) {
      case "student":
        return renderStudentProfile();
      case "business_owner":
        return renderBusinessProfile();
      case "employee":
        return renderEmployeeProfile();
      case "writer":
        return renderWriterProfile();
      default:
        return <p>No specific profile for this role.</p>;
    }
  };

  return (
    <div className="border rounded-md p-4 bg-muted/10 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium">{getRoleTitle(role)} Profile</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onEditClick}
          className="h-7 w-7 p-0"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
      {renderProfileContent()}
    </div>
  );
};

const getRoleTitle = (role: AIAssistantRole) => {
  switch (role) {
    case "student": return "Student";
    case "business_owner": return "Business";
    case "employee": return "Work";
    case "writer": return "Writer";
    default: return "General";
  }
};
