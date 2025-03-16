
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";

const AboutStory = () => {
  return (
    <SectionContainer>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4">
            <p>
              WAKTI was founded in 2022 by a team of productivity enthusiasts who were frustrated with 
              juggling multiple tools for task management, scheduling, and communication.
            </p>
            <p>
              We believed there had to be a better way to manage all these aspects of work in one unified platform. 
              After months of research and development, we launched the first version of WAKTI with a simple goal: 
              to create an all-in-one productivity solution that's powerful yet intuitive.
            </p>
            <p>
              Today, WAKTI is used by thousands of individuals and businesses worldwide, from freelancers and 
              small teams to large enterprises. We're constantly evolving our platform based on user feedback 
              to make it the most effective productivity tool on the market.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="WAKTI team collaborating" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-background border rounded-lg p-4 shadow-lg w-32 h-32 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-wakti-blue">3K+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default AboutStory;
