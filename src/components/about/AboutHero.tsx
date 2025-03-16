
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";

const AboutHero = () => {
  return (
    <SectionContainer className="text-center py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">About WAKTI</h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        Empowering individuals and businesses with intelligent productivity tools
        to manage tasks, appointments, and team collaboration in one unified platform.
      </p>
    </SectionContainer>
  );
};

export default AboutHero;
