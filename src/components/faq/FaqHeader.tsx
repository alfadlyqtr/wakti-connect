
import React from "react";

interface FaqHeaderProps {
  title: string;
  description: string;
}

const FaqHeader = ({ title, description }: FaqHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  );
};

export default FaqHeader;
