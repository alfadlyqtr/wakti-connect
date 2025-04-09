
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

  const getCurrencyPrefix = () => {
    return currency === "QAR" ? "QAR" : "$";
  };

  const formatPrice = (price: string) => {
    return price;
  };

  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      description: "Basic features to get started",
      price: "0",
      period: "forever",
      features: [
        "1 task per month",
        "View appointments",
        "Individual messaging (1 per month)",
        "Basic support"
      ],
      buttonText: "Get Started",
      buttonLink: "/auth?tab=register&plan=free",
      highlight: false,
    },
    {
      name: "Individual",
      description: "Everything you need for personal productivity",
      price: billingCycle === "monthly" 
        ? `${getCurrencyPrefix()} ${formatPrice(getPrice(20))}` 
        : `${getCurrencyPrefix()} ${formatPrice(getPrice(20))}`,
      period: billingCycle === "monthly" ? "per month" : "per year",
      savings: billingCycle === "yearly" ? `Save ${getCurrencyPrefix()} ${formatPrice(getSavings(20))}/year` : null,
      features: [
        "Unlimited tasks",
        "Create and manage appointments",
        "Individual messaging",
        "Priority support"
      ],
      buttonText: "Choose Plan",
      buttonLink: "/auth?tab=register&plan=individual",
      highlight: false,
    },
    {
      name: "Business",
      description: "Advanced features for business management",
      price: billingCycle === "monthly" 
        ? `${getCurrencyPrefix()} ${formatPrice(getPrice(45))}` 
        : `${getCurrencyPrefix()} ${formatPrice(getPrice(45))}`,
      period: billingCycle === "monthly" ? "per month" : "per year",
      savings: billingCycle === "yearly" ? `Save ${getCurrencyPrefix()} ${formatPrice(getSavings(45))}/year` : null,
      features: [
        "All Individual features",
        "Business profile page",
        "Customer booking system",
        "Staff management (up to 6)",
        "TMW AI Chatbot integration"
      ],
      buttonText: "Choose Plan",
      buttonLink: "/auth?tab=register&plan=business",
      highlight: true,
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
