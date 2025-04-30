
import React from "react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { FeatureCallToAction } from "@/components/features/FeatureCallToAction";
import { FeatureSection } from "@/components/ui/feature-section";
import { CalendarDays, MessageSquare, Users, BarChart4, Sparkles, CheckCircle } from "lucide-react";

const FeaturesPage = () => {
  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Task Management",
      description: "Create, organize, and track tasks with priorities and deadlines",
      delay: "0ms"
    },
    {
      icon: <CalendarDays className="h-6 w-6 text-wakti-gold" />,
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
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="py-12 md:py-24 bg-muted/30">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Powerful Features</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to manage your work and business efficiently
            </p>
          </div>
        </Container>
      </div>
      
      {/* Features grid */}
      <div className="py-12 md:py-16">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureSection
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={feature.delay}
              />
            ))}
          </div>
        </Container>
      </div>
      
      {/* Call to action */}
      <FeatureCallToAction />
    </div>
  );
};

export default FeaturesPage;
