
import React from "react";
import PriceCard from "./PriceCard";
import PricingHeading from "./PricingHeading";

const Pricing = () => {
  const plans = [
    {
      title: "Free",
      price: "Free",
      description: "Basic features to get started",
      features: ["1 task per month", "View appointments", "Individual messaging", "Basic support"],
      buttonText: "Get Started",
      buttonLink: "/auth?tab=register&plan=free",
      variant: "outline",
      popular: false,
      delay: "0ms"
    },
    {
      title: "Individual",
      price: "QAR 20",
      description: "Everything you need for personal productivity",
      features: ["Unlimited tasks", "Create and manage appointments", "Individual messaging", "Priority support"],
      buttonText: "Choose Plan",
      buttonLink: "/auth?tab=register&plan=individual",
      variant: "outline",
      popular: false,
      delay: "100ms"
    },
    {
      title: "Business",
      price: "QAR 45",
      description: "Advanced features for business management",
      features: ["All Individual features", "Business profile page", "Customer booking system", "Staff management", "TMW AI Chatbot integration"],
      buttonText: "Choose Plan",
      buttonLink: "/auth?tab=register&plan=business",
      variant: "default",
      popular: true,
      delay: "200ms"
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <PricingHeading 
          title="Simple, Transparent Pricing" 
          subtitle="Choose the plan that fits your needs"
        />
        
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
