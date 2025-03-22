
import { useState } from "react";
import { useTranslation } from "@/components/mocks/translationMock";

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
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

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
    if (isRtl) {
      return currency === "QAR" ? "ر.ق" : "$";
    }
    return currency === "QAR" ? "QAR" : "$";
  };

  const formatPrice = (price: string) => {
    if (isRtl && currency === "QAR") {
      // For Arabic, display QAR price with Arabic numerals
      return price.replace(/[0-9]/g, (digit) => 
        String.fromCharCode(digit.charCodeAt(0) + 1584)
      );
    }
    return price;
  };

  const pricingPlans: PricingPlan[] = [
    {
      name: String(t('pricing.plans.free.title')),
      description: String(t('pricing.plans.free.description')),
      price: "0",
      period: String(t('pricing.forever')),
      features: Array.isArray(t('pricing.plans.free.features', { returnObjects: true })) 
        ? t('pricing.plans.free.features', { returnObjects: true }) as string[] 
        : [],
      buttonText: String(t('pricing.plans.free.buttonText')),
      buttonLink: "/auth?tab=register&plan=free",
      highlight: false,
    },
    {
      name: String(t('pricing.plans.individual.title')),
      description: String(t('pricing.plans.individual.description')),
      price: billingCycle === "monthly" 
        ? `${getCurrencyPrefix()} ${formatPrice(getPrice(20))}` 
        : `${getCurrencyPrefix()} ${formatPrice(getPrice(20))}`,
      period: billingCycle === "monthly" ? String(t('pricing.perMonth')) : String(t('pricing.perYear')),
      savings: billingCycle === "yearly" ? `${String(t('pricing.save'))} ${getCurrencyPrefix()} ${formatPrice(getSavings(20))}/${String(t('pricing.year'))}` : null,
      features: Array.isArray(t('pricing.plans.individual.features', { returnObjects: true })) 
        ? t('pricing.plans.individual.features', { returnObjects: true }) as string[] 
        : [],
      buttonText: String(t('pricing.plans.individual.buttonText')),
      buttonLink: "/auth?tab=register&plan=individual",
      highlight: false,
    },
    {
      name: String(t('pricing.plans.business.title')),
      description: String(t('pricing.plans.business.description')),
      price: billingCycle === "monthly" 
        ? `${getCurrencyPrefix()} ${formatPrice(getPrice(45))}` 
        : `${getCurrencyPrefix()} ${formatPrice(getPrice(45))}`,
      period: billingCycle === "monthly" ? String(t('pricing.perMonth')) : String(t('pricing.perYear')),
      savings: billingCycle === "yearly" ? `${String(t('pricing.save'))} ${getCurrencyPrefix()} ${formatPrice(getSavings(45))}/${String(t('pricing.year'))}` : null,
      features: Array.isArray(t('pricing.plans.business.features', { returnObjects: true })) 
        ? t('pricing.plans.business.features', { returnObjects: true }) as string[] 
        : [],
      buttonText: String(t('pricing.plans.business.buttonText')),
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
