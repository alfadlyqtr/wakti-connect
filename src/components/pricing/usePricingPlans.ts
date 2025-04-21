
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
      name: "Individual",
      description: "Everything you need for personal productivity",
      price: billingCycle === "monthly" 
        ? `${getCurrencyPrefix()} ${formatPrice(getPrice(35))}` 
        : `${getCurrencyPrefix()} ${formatPrice(getPrice(35))}`,
      period: billingCycle === "monthly" ? "per month" : "per year",
      savings: billingCycle === "yearly" ? `Save ${getCurrencyPrefix()} ${formatPrice(getSavings(35))}/year` : null,
      features: [
        "3-day free trial",
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
        ? `${getCurrencyPrefix()} ${formatPrice(getPrice(50))}` 
        : `${getCurrencyPrefix()} ${formatPrice(getPrice(50))}`,
      period: billingCycle === "monthly" ? "per month" : "per year",
      savings: billingCycle === "yearly" ? `Save ${getCurrencyPrefix()} ${formatPrice(getSavings(50))}/year` : null,
      features: [
        "3-day free trial",
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
