
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";

const AboutHero = () => {
  return (
    <SectionContainer className="text-center py-16 md:py-24 bg-gradient-to-b from-wakti-blue/5 to-background">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-wakti-blue to-blue-600">About WAKTI</h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
        Welcome to WAKTI, the all-in-one productivity and business management platform designed to streamline tasks, appointments, event invitations, and business operations—effortlessly connecting people and businesses.
      </p>
    </SectionContainer>
  );
};

export default AboutHero;
