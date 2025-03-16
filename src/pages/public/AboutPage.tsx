
import React from "react";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutVisionMission from "@/components/about/AboutVisionMission";
import AboutValues from "@/components/about/AboutValues";
import AboutTeam from "@/components/about/AboutTeam";
import AboutCTA from "@/components/about/AboutCTA";

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <AboutStory />
      <AboutVisionMission />
      <AboutValues />
      <AboutTeam />
      <AboutCTA />
    </div>
  );
};

export default AboutPage;
