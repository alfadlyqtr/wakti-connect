
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FeatureDetail from "@/components/features/FeatureDetail";

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  period: string;
  savings?: string | null;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlight: boolean;
}

const PricingCard = ({
  name,
  description,
  price,
  period,
  savings,
  features,
  buttonText,
  buttonLink,
  highlight,
}: PricingCardProps) => {
  return (
    <Card
      className={`flex flex-col ${
        highlight
          ? "border-wakti-blue shadow-lg relative overflow-hidden"
          : ""
      }`}
    >
      {highlight && (
        <div className="absolute top-0 right-0 bg-wakti-blue text-white px-4 py-1 text-sm font-medium">
          Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-6">
          <span className="text-4xl font-bold">
            {price === "0" ? "Free" : `QAR ${price}`}
          </span>
          <span className="text-muted-foreground ml-2">
            {period}
          </span>
          {savings && (
            <div className="mt-1">
              <span className="text-sm text-green-500">{savings}</span>
            </div>
          )}
        </div>
        <FeatureDetail features={features} />
      </CardContent>
      <CardFooter>
        <Button
          className={`w-full ${
            highlight ? "bg-wakti-blue hover:bg-wakti-blue/90" : ""
          }`}
          asChild
        >
          <Link to={buttonLink}>{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
