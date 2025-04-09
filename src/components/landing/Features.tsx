
import React from "react";
import { CheckCircle, Calendar, Users, MessageSquare, BarChart4, Sparkles } from "lucide-react";
import FeatureCard from "./FeatureCard";
import FeaturesHeading from "./FeaturesHeading";

const Features = () => {
  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Task Management",
      description: "Create, organize, and track tasks with priorities and deadlines",
      delay: "0ms"
    },
    {
      icon: <Calendar className="h-6 w-6 text-wakti-gold" />,
      title: "Appointment Booking",
      description: "Schedule and manage appointments with automatic reminders",
      delay: "100ms"
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "Team Collaboration",
      description: "Assign tasks and share calendars with your team",
      delay: "200ms"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-wakti-blue" />,
      title: "Messaging",
      description: "Built-in messaging for effective team communication",
      delay: "300ms"
    },
    {
      icon: <BarChart4 className="h-6 w-6 text-purple-500" />,
      title: "Business Analytics",
      description: "Track performance with detailed analytics and reports",
      delay: "400ms"
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-500" />,
      title: "AI Integration",
      description: "Advanced AI tools to boost productivity",
      delay: "500ms"
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <FeaturesHeading 
          title="Powerful Features" 
          subtitle="Everything you need to manage your work and business efficiently"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
