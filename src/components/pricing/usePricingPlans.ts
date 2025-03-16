
import { useState } from "react";

export type BillingCycle = "monthly" | "yearly";

export interface PricingPlan {
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

export const usePricingPlans = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const getPrice = (basePrice: number) => {
    return billingCycle === "yearly" ? (basePrice * 10).toFixed(2) : basePrice.toFixed(2);
  };

  const getSavings = (basePrice: number) => {
    return (basePrice * 12 - basePrice * 10).toFixed(2);
  };

  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      description: "For basic access",
      price: "0",
      period: "forever",
      features: [
        "1 task/month",
        "View appointments & tasks",
        "Message individual users (1 per month)",
        "Accept invitations",
        "View notifications"
      ],
      buttonText: "Sign Up Free",
      buttonLink: "/auth?tab=register&plan=free",
      highlight: false,
    },
    {
      name: "Individual",
      description: "For personal productivity",
      price: billingCycle === "monthly" ? "20" : "200",
      period: billingCycle === "monthly" ? "per month" : "per year",
      savings: billingCycle === "yearly" ? "Save QAR 40/year" : null,
      features: [
        "Unlimited tasks",
        "Create & manage appointments",
        "Message individual users",
        "Full contact management",
        "Priority support"
      ],
      buttonText: "Start 14-Day Trial",
      buttonLink: "/auth?tab=register&plan=individual",
      highlight: true,
    },
    {
      name: "Business",
      description: "For teams and businesses",
      price: billingCycle === "monthly" ? "45" : "400",
      period: billingCycle === "monthly" ? "per month" : "per year",
      savings: billingCycle === "yearly" ? "Save QAR 140/year" : null,
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
      highlight: false,
    },
  ];

  return {
    billingCycle,
    setBillingCycle,
    pricingPlans,
  };
};
