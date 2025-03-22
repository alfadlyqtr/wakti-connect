
import React from "react";
import PriceCard from "./PriceCard";
import PricingHeading from "./PricingHeading";
import { useTranslation } from "@/components/mocks/translationMock";

const Pricing = () => {
  const { t } = useTranslation();
  
  const plans = [
    {
      title: String(t('pricing.plans.free.title')),
      price: String(t('pricing.plans.free.title')),
      description: String(t('pricing.plans.free.description')),
      features: t('pricing.plans.free.features', { returnObjects: true }) as string[] || [],
      buttonText: String(t('pricing.plans.free.buttonText')),
      buttonLink: "/auth?tab=register&plan=free",
      variant: "outline",
      popular: false,
      delay: "0ms"
    },
    {
      title: String(t('pricing.plans.individual.title')),
      price: "QAR 20",
      description: String(t('pricing.plans.individual.description')),
      features: t('pricing.plans.individual.features', { returnObjects: true }) as string[] || [],
      buttonText: String(t('pricing.plans.individual.buttonText')),
      buttonLink: "/auth?tab=register&plan=individual",
      variant: "outline",
      popular: false,
      delay: "100ms"
    },
    {
      title: String(t('pricing.plans.business.title')),
      price: "QAR 45",
      description: String(t('pricing.plans.business.description')),
      features: t('pricing.plans.business.features', { returnObjects: true }) as string[] || [],
      buttonText: String(t('pricing.plans.business.buttonText')),
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
          title={String(t('pricing.title'))} 
          subtitle={String(t('pricing.subtitle'))}
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
