
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface FaqCtaProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const FaqCta = ({ title, description, buttonText, buttonLink }: FaqCtaProps) => {
  return (
    <div className="text-center py-12 mt-12 border-t">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-muted-foreground max-w-xl mx-auto mb-6">
        {description}
      </p>
      <Button asChild>
        <Link to={buttonLink}>{buttonText}</Link>
      </Button>
    </div>
  );
};

export default FaqCta;
