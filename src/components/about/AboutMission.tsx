
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";
import { Rocket, Sparkles, Users } from "lucide-react";

const AboutMission = () => {
  return (
    <SectionContainer className="py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-wakti-blue/10 rounded-full flex items-center justify-center">
            <Rocket className="text-wakti-blue h-8 w-8" />
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Our Mission</h2>
        
        <p className="text-xl text-center text-muted-foreground mb-12 leading-relaxed">
          At WAKTI, we help individuals and businesses stay organized, save time, and enhance productivity 
          with powerful tools built for seamless task management, event coordination, and business operations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-background p-8 rounded-lg shadow-sm border text-center">
            <div className="w-12 h-12 bg-wakti-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-wakti-blue h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-4">For Individuals</h3>
            <p className="text-muted-foreground">
              Stay on top of your tasks, set reminders, and send customized event invitations to other users 
              or via WhatsApp, Email, or SMS.
            </p>
          </div>
          
          <div className="bg-background p-8 rounded-lg shadow-sm border text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 h-6 w-6">
                <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
                <path d="M9 16.5v-4" />
                <path d="M12 13v-2" />
                <path d="M15 16.5v-7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">For Businesses</h3>
            <p className="text-muted-foreground">
              Manage staff, assign tasks, schedule appointments, and create a fully customizable business profile 
              with an integrated booking system and AI chatbot.
            </p>
          </div>
          
          <div className="bg-background p-8 rounded-lg shadow-sm border text-center">
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-purple-500 h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-4">For Everyone</h3>
            <p className="text-muted-foreground">
              Enjoy a mobile-friendly, real-time platform with notifications, AI-powered assistance, and a user-friendly 
              interface for both personal and professional needs.
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default AboutMission;
