
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
  features,
  buttonText,
  buttonLink,
  variant = "default",
  popular = false,
  delay = "0ms"
}: PriceCardProps) => {
  const borderClasses = popular
    ? "border-2 border-primary"
    : "border border-border";

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
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
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

const Pricing = () => {
  const plans = [
    {
      title: "Free",
      price: "$0",
      description: "Basic access for personal use",
      features: [
        "View appointments & tasks",
        "Accept invitations",
        "Subscribe to 1 business",
        "View notifications"
      ],
      buttonText: "Sign Up Free",
      buttonLink: "/auth?tab=register&plan=free",
      variant: "outline",
      popular: false,
      delay: "0ms"
    },
    {
      title: "Individual",
      price: "$9.99",
      description: "Full access for individual professionals",
      features: [
        "Create, edit, and delete tasks",
        "Share tasks with other users",
        "Create and send invitations",
        "Unlimited contacts",
        "Message individuals & businesses"
      ],
      buttonText: "Start 14-Day Trial",
      buttonLink: "/auth?tab=register&plan=individual",
      variant: "default",
      popular: true,
      delay: "100ms"
    },
    {
      title: "Business",
      price: "$29.99",
      description: "Advanced features for businesses",
      features: [
        "All Individual features",
        "Assign tasks to staff",
        "Track staff logins & hours",
        "Public booking system",
        "Business analytics"
      ],
      buttonText: "Start 14-Day Trial",
      buttonLink: "/auth?tab=register&plan=business",
      variant: "outline",
      popular: false,
      delay: "200ms"
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan that fits your needs, from individual users to large businesses.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PriceCard
              key={index}
              title={plan.title}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              buttonText={plan.buttonText}
              buttonLink={plan.buttonLink}
              variant={plan.variant as "default" | "outline" | "primary"}
              popular={plan.popular}
              delay={plan.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
