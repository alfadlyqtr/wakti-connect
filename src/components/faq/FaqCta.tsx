
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface FaqCtaProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const FaqCta = ({ 
  title, 
  description, 
  buttonText, 
  buttonLink 
}: FaqCtaProps) => {
  return (
    <div className="mt-20 text-center">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-muted-foreground mb-8">{description}</p>
      <Button size="lg" asChild>
        <Link to={buttonLink}>{buttonText}</Link>
      </Button>
    </div>
  );
};

export default FaqCta;
