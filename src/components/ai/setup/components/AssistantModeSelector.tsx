
import React from "react";
import { Button } from "@/components/ui/button";
import { useAISetup, UserRole, AssistantMode } from "../context/AISetupContext";

export const AssistantModeSelector: React.FC = () => {
  const { userRole, handleModeSelect } = useAISetup();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Choose Your Assistant Mode</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userRole === "student" && (
          <>
            <Button 
              variant="outline" 
              className="flex flex-col items-start h-auto p-4 text-left" 
              onClick={() => handleModeSelect("tutor")}
            >
              <span className="font-bold">Tutor</span>
              <span className="text-sm text-muted-foreground">
                Helps with homework, explains concepts, and assists with studying
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-start h-auto p-4 text-left" 
              onClick={() => handleModeSelect("content_creator")}
            >
              <span className="font-bold">Essay Helper</span>
              <span className="text-sm text-muted-foreground">
                Assists with writing assignments, research, and creative projects
              </span>
            </Button>
          </>
        )}
        
        {userRole === "professional" && (
          <>
            <Button 
              variant="outline" 
              className="flex flex-col items-start h-auto p-4 text-left" 
              onClick={() => handleModeSelect("personal_assistant")}
            >
              <span className="font-bold">Personal Assistant</span>
              <span className="text-sm text-muted-foreground">
                Helps with tasks, scheduling, and daily productivity
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-start h-auto p-4 text-left" 
              onClick={() => handleModeSelect("project_manager")}
            >
              <span className="font-bold">Project Manager</span>
              <span className="text-sm text-muted-foreground">
                Focuses on organizing workflows, tracking progress, and meeting deadlines
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-start h-auto p-4 text-left" 
              onClick={() => handleModeSelect("content_creator")}
            >
              <span className="font-bold">Content Creator</span>
              <span className="text-sm text-muted-foreground">
                Specializes in writing emails, reports, and professional documents
              </span>
            </Button>
          </>
        )}
        
        {userRole === "business_owner" && (
          <>
            <Button 
              variant="outline" 
              className="flex flex-col items-start h-auto p-4 text-left" 
              onClick={() => handleModeSelect("business_manager")}
            >
              <span className="font-bold">Business Manager</span>
              <span className="text-sm text-muted-foreground">
                Helps with operations, staff coordination, and business analytics
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-start h-auto p-4 text-left" 
              onClick={() => handleModeSelect("content_creator")}
            >
              <span className="font-bold">Marketing Assistant</span>
              <span className="text-sm text-muted-foreground">
                Focuses on creating marketing content, emails, and business copy
              </span>
            </Button>
          </>
        )}
        
        {userRole === "other" && (
          <>
            <Button 
              variant="outline" 
              className="flex flex-col items-start h-auto p-4 text-left" 
              onClick={() => handleModeSelect("text_generator")}
            >
              <span className="font-bold">Email & Signature Creator</span>
              <span className="text-sm text-muted-foreground">
                Creates email signatures, templates, and professional correspondence
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-start h-auto p-4 text-left" 
              onClick={() => handleModeSelect("content_creator")}
            >
              <span className="font-bold">Document Creator</span>
              <span className="text-sm text-muted-foreground">
                Helps draft documents, reports, and other written content
              </span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
