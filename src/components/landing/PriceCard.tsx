
import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PriceCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  variant?: "default" | "primary" | "outline";
  popular?: boolean;
  delay?: string;
}

const PriceCard = ({
  title,
  price,
  description,
  features = [],
  buttonText,
  buttonLink,
  variant = "default",
  popular = false,
  delay = "0ms"
}: PriceCardProps) => {
  const borderClasses = popular
    ? "border-2 border-primary"
    : "border border-border";

  // Ensure features is always treated as an array
  const featuresList = Array.isArray(features) ? features : [];

  return (
    <div
      className={`bg-card ${borderClasses} rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 relative animate-slide-in`}
      style={{ animationDelay: delay }}
    >
      {popular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground py-1 px-3 text-xs font-medium">
          Popular
        </div>
      )}
      
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="flex items-end gap-1 mb-4">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground pb-1">/month</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      
      <div className="p-6">
        <ul className="space-y-3">
          {featuresList.length > 0 ? (
            featuresList.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))
          ) : (
            <li className="text-muted-foreground">No features available</li>
          )}
        </ul>
        
        <Button 
          asChild 
          variant={popular ? "default" : "outline"} 
          className="w-full mt-6"
        >
          <Link to={buttonLink}>
            {buttonText}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PriceCard;
