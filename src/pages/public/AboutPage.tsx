
import React from "react";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutMission from "@/components/about/AboutMission";
import AboutValues from "@/components/about/AboutValues";
import AboutTeam from "@/components/about/AboutTeam";
import AboutFeatures from "@/components/about/AboutFeatures";
import AboutCTA from "@/components/about/AboutCTA";

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <AboutMission />
      <AboutStory />
      <AboutFeatures />
      <AboutValues />
      <AboutTeam />
      <AboutCTA />
    </div>
  );
};

export default AboutPage;
