
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";

const AboutStory = () => {
  return (
    <SectionContainer className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="bg-muted/30 rounded-lg p-6 h-[400px] flex items-center justify-center">
          <div className="w-64 h-64 bg-wakti-blue/20 rounded-full flex items-center justify-center relative">
            <div className="w-48 h-48 bg-wakti-blue/40 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-wakti-blue rounded-full flex items-center justify-center text-white font-bold text-3xl">
                W
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-lg">
            <p>
              WAKTI was born from a simple observation: people and businesses in Qatar needed better tools to manage their daily productivity and appointments.
            </p>
            <p>
              Founded in 2022, our team of entrepreneurs and developers set out to create an application that would solve the fragmented nature of productivity and business management software.
            </p>
            <p>
              We recognized that existing tools often required users to juggle multiple applications for tasks, scheduling, and team management. Our vision was to create a unified platform where all these essential functions could live together seamlessly.
            </p>
            <p>
              Today, WAKTI serves thousands of individuals and businesses across Qatar and the Middle East, helping them save time, stay organized, and collaborate effectively.
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default AboutStory;
