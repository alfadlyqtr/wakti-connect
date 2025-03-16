
import React from "react";
import PriceCard from "./PriceCard";
import PricingHeading from "./PricingHeading";

const Pricing = () => {
  const plans = [
    {
      title: "Free",
      price: "Free",
      description: "Basic access for personal use",
      features: [
        "1 task/month",
        "View appointments & tasks",
        "Message individual users (1 per month)",
        "Accept invitations",
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
      price: "QAR 20",
      description: "Full access for individual professionals",
      features: [
        "Unlimited tasks",
        "Create & manage appointments",
        "Message individual users",
        "Full contact management",
        "Priority support"
      ],
      buttonText: "Start 14-Day Trial",
      buttonLink: "/auth?tab=register&plan=individual",
      variant: "default",
      popular: true,
      delay: "100ms"
    },
    {
      title: "Business",
      price: "QAR 45",
      description: "Advanced features for businesses",
      features: [
        "All Individual features",
        "Business profile page",
        "Customer booking system",
        "Staff management (up to 6 staff)",
        "TMW AI Chatbot Integration",
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
        <PricingHeading 
          title="Choose Your Plan" 
          subtitle="Select the perfect plan that fits your needs, from individual users to large businesses."
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
