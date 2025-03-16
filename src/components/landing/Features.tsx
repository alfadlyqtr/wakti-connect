
import React from "react";
import { CheckCircle, Calendar, Users, MessageSquare, BarChart4, Sparkles } from "lucide-react";
import FeatureCard from "./FeatureCard";
import FeaturesHeading from "./FeaturesHeading";

const Features = () => {
  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Task Management",
      description: "Create, organize, and track your tasks with ease. Set priorities and deadlines to stay on top of your work.",
      delay: "0ms"
    },
    {
      icon: <Calendar className="h-6 w-6 text-wakti-gold" />,
      title: "Appointment Booking",
      description: "Schedule and manage appointments. Send invites and get confirmations in real-time.",
      delay: "100ms"
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "Team Collaboration",
      description: "Assign tasks, share calendars, and coordinate team activities efficiently.",
      delay: "200ms"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-wakti-blue" />,
      title: "Messaging",
      description: "Communicate with team members and clients without leaving the platform.",
      delay: "300ms"
    },
    {
      icon: <BarChart4 className="h-6 w-6 text-purple-500" />,
      title: "Analytics",
      description: "Track productivity metrics, task completion rates, and team performance.",
      delay: "400ms"
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-500" />,
      title: "AI Integration",
      description: "AI-powered chatbot to assist with task scheduling and management (Business plan).",
      delay: "500ms"
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <FeaturesHeading 
          title="Everything You Need" 
          subtitle="Discover the powerful features that help streamline your workflow and boost productivity."
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
