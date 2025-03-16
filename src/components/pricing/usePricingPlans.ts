
import { useState } from "react";

export type BillingCycle = "monthly" | "yearly";
export type Currency = "QAR" | "USD";

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
  const [currency, setCurrency] = useState<Currency>("QAR");

  const getQarPrice = (basePrice: number) => {
    return billingCycle === "yearly" ? (basePrice * 10).toFixed(2) : basePrice.toFixed(2);
  };

  const getUsdPrice = (basePrice: number) => {
    const qarPrice = parseFloat(getQarPrice(basePrice));
    return (qarPrice / 3.64).toFixed(2);
  };

  const getPrice = (basePrice: number) => {
    return currency === "QAR" ? getQarPrice(basePrice) : getUsdPrice(basePrice);
  };

  const getSavings = (basePrice: number) => {
    if (currency === "QAR") {
      return (basePrice * 12 - basePrice * 10).toFixed(2);
    } else {
      return ((basePrice * 12 - basePrice * 10) / 3.64).toFixed(2);
    }
  };

  const getCurrencyPrefix = () => currency === "QAR" ? "QAR" : "$";

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
      price: billingCycle === "monthly" ? getPrice(20) : getPrice(20),
      period: billingCycle === "monthly" ? "per month" : "per year",
      savings: billingCycle === "yearly" ? `Save ${getCurrencyPrefix()} ${getSavings(20)}/year` : null,
      features: [
        "Unlimited tasks",
        "Create & manage appointments",
        "Message individual users",
        "Custom event creation & sharing",
        "Full contact management",
        "Priority support"
      ],
      buttonText: "Start 3-Day Trial",
      buttonLink: "/auth?tab=register&plan=individual",
      highlight: true,
    },
    {
      name: "Business",
      description: "For teams and businesses",
      price: billingCycle === "monthly" ? getPrice(45) : getPrice(45),
      period: billingCycle === "monthly" ? "per month" : "per year",
      savings: billingCycle === "yearly" ? `Save ${getCurrencyPrefix()} ${getSavings(45)}/year` : null,
      features: [
        "All Individual features",
        "Business profile page",
        "Customer booking system",
        "Staff management (up to 6 staff)",
        "TMW AI Chatbot Integration",
        "Business analytics"
      ],
      buttonText: "Start 3-Day Trial",
      buttonLink: "/auth?tab=register&plan=business",
      highlight: false,
    },
  ];

  return {
    billingCycle,
    setBillingCycle,
    currency,
    setCurrency,
    pricingPlans,
  };
};
