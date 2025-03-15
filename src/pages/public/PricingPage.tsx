
import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PricingPage = () => {
  const pricingPlans = [
    {
      name: "Free",
      description: "For individuals just getting started",
      price: "$0",
      period: "forever",
      features: [
        "View-only access to tasks",
        "View-only access to appointments",
        "Limited notifications",
        "Basic dashboard",
      ],
      buttonText: "Sign Up Free",
      buttonLink: "/auth",
      highlight: false,
    },
    {
      name: "Individual",
      description: "For personal productivity",
      price: "$9.99",
      period: "per month",
      features: [
        "Full task management",
        "Full appointment scheduling",
        "Messaging capabilities",
        "Contact management",
        "Full notifications",
        "Priority support",
      ],
      buttonText: "Get Started",
      buttonLink: "/auth",
      highlight: true,
    },
    {
      name: "Business",
      description: "For teams and businesses",
      price: "$29.99",
      period: "per month",
      features: [
        "Everything in Individual",
        "Team task assignments",
        "Business-wide appointments",
        "Staff management",
        "Work logs & tracking",
        "Service management",
        "Business analytics & reports",
        "Premium support",
      ],
      buttonText: "Contact Sales",
      buttonLink: "/contact",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Transparent Pricing for Everyone</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start with our free tier and upgrade as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col ${
                plan.highlight
                  ? "border-wakti-blue shadow-lg relative overflow-hidden"
                  : ""
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-wakti-blue text-white px-4 py-1 text-sm font-medium">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-wakti-blue shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.highlight ? "bg-wakti-blue hover:bg-wakti-blue/90" : ""
                  }`}
                  asChild
                >
                  <Link to={plan.buttonLink}>{plan.buttonText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mb-8">
            Have more questions? Visit our{" "}
            <Link to="/faq" className="text-wakti-blue hover:underline">
              FAQ page
            </Link>{" "}
            or{" "}
            <Link to="/contact" className="text-wakti-blue hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
