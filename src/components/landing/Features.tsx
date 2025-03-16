
import React from "react";
import { CheckCircle, Calendar, Users, MessageSquare, BarChart4, Sparkles } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: string;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <div 
      className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-all duration-300 animate-slide-in"
      style={{ animationDelay: delay }}
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

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
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the powerful features that help streamline your workflow and boost productivity.
          </p>
        </div>
        
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
