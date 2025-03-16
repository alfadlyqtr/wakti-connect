
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Clock, Users, Shield, Zap, Globe, Heart } from "lucide-react";

const AboutValues = () => {
  const values = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Efficiency First",
      description: "We believe your time is precious. Everything we build aims to save you time and boost your productivity."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Customer Obsessed",
      description: "Our customers are at the heart of every decision we make. Your success is our success."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Trust & Security",
      description: "We take data privacy seriously and implement robust security measures to protect your information."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Continuous Innovation",
      description: "We're constantly improving our platform with new features and enhancements based on user feedback."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Mindset",
      description: "We design for users across the world, considering diverse needs and accessibility requirements."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Passionate Team",
      description: "Our team is passionate about building tools that make a positive impact on how people work."
    }
  ];
  
  return (
    <SectionContainer>
      <SectionHeading 
        title="Our Values" 
        subtitle="These core principles guide everything we do at WAKTI, from product development to customer support."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {values.map((value, index) => (
          <div key={index} className="bg-background p-6 rounded-lg border hover:shadow-md transition-all">
            <div className="bg-wakti-blue/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 text-wakti-blue">
              {value.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
            <p className="text-muted-foreground">{value.description}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default AboutValues;
