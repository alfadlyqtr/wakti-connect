
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";
import { Shield, Users, Sparkles, Clock } from "lucide-react";

const AboutValues = () => {
  const values = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Trust & Security",
      description: "We treat your data with the utmost respect, implementing robust security measures and transparent privacy policies."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "User-Centered Design",
      description: "Every feature we build starts with understanding our users' needs and challenges, ensuring intuitive and helpful solutions."
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Continuous Innovation",
      description: "We're committed to staying ahead of productivity trends and constantly improving our platform based on feedback and new technologies."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Time Efficiency",
      description: "We believe that time is your most valuable resource, and our tools are designed to help you make the most of every minute."
    }
  ];

  return (
    <SectionContainer className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {values.map((value, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 bg-wakti-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-wakti-blue">
                {value.icon}
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3">{value.title}</h3>
            <p className="text-muted-foreground">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default AboutValues;
