
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";
import { Lightbulb, Target, MoveUp } from "lucide-react";

const AboutVisionMission = () => {
  return (
    <SectionContainer className="py-16 bg-muted/30">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-background p-8 rounded-lg shadow-sm border">
          <div className="w-12 h-12 bg-wakti-blue/10 rounded-full flex items-center justify-center mb-6">
            <Lightbulb className="text-wakti-blue h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
          <p className="text-muted-foreground">
            To create a world where productivity tools enhance human potential instead of adding complexity, allowing individuals and businesses to focus on what truly matters.
          </p>
        </div>
        
        <div className="bg-background p-8 rounded-lg shadow-sm border">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
            <Target className="text-green-500 h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
          <p className="text-muted-foreground">
            To provide an integrated platform that simplifies task management, appointment scheduling, and team collaboration for individuals and businesses of all sizes.
          </p>
        </div>
        
        <div className="bg-background p-8 rounded-lg shadow-sm border">
          <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
            <MoveUp className="text-purple-500 h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Our Goals</h3>
          <p className="text-muted-foreground">
            To continuously innovate and expand our platform based on user feedback, creating tools that adapt to the evolving needs of our diverse user base across the MENA region.
          </p>
        </div>
      </div>
    </SectionContainer>
  );
};

export default AboutVisionMission;
