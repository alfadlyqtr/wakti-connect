
import React from "react";

interface WelcomeMessageProps {
  user: any;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ user }) => {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">
        {getTimeBasedGreeting()}, {user?.displayName || user?.name || "there"}!
      </h1>
      <p className="text-muted-foreground mt-1">
        Here's an overview of your tasks and schedule.
      </p>
    </div>
  );
};

export default WelcomeMessage;
