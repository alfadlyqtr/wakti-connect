
import React from "react";

interface WelcomeMessageProps {
  user: any;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ user }) => {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  const userName = user?.displayName || user?.name || "there";
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">
        {getTimeBasedGreeting()}, {userName}
      </h1>
      <p className="text-muted-foreground mt-1">
        Here's an overview of your activity
      </p>
    </div>
  );
};

export default WelcomeMessage;
