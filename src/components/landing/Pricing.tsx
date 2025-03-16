
import React from "react";
import PriceCard from "./PriceCard";
import PricingHeading from "./PricingHeading";
import { useTranslation } from "react-i18next";

const Pricing = () => {
  const { t } = useTranslation();
  
  const plans = [
    {
      title: t('pricing.plans.free.title'),
      price: t('pricing.plans.free.title'),
      description: t('pricing.plans.free.description'),
      features: t('pricing.plans.free.features', { returnObjects: true }) as string[],
      buttonText: t('pricing.plans.free.buttonText'),
      buttonLink: "/auth?tab=register&plan=free",
      variant: "outline",
      popular: false,
      delay: "0ms"
    },
    {
      title: t('pricing.plans.individual.title'),
      price: "QAR 20",
      description: t('pricing.plans.individual.description'),
      features: t('pricing.plans.individual.features', { returnObjects: true }) as string[],
      buttonText: t('pricing.plans.individual.buttonText'),
      buttonLink: "/auth?tab=register&plan=individual",
      variant: "outline",
      popular: false,
      delay: "100ms"
    },
    {
      title: t('pricing.plans.business.title'),
      price: "QAR 45",
      description: t('pricing.plans.business.description'),
      features: t('pricing.plans.business.features', { returnObjects: true }) as string[],
      buttonText: t('pricing.plans.business.buttonText'),
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
          title={t('pricing.title')} 
          subtitle={t('pricing.subtitle')}
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
