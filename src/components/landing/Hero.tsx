
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Hero = () => {
  // Add fallbacks for translation in case i18n isn't fully loaded
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  // Default text values in case translations aren't loaded
  const defaultTexts = {
    tagline: "All-in-One Platform",
    title: "WAKTI - Your Business Productivity Solution",
    description: "Manage tasks, appointments, contacts and more in one powerful platform designed for individuals and businesses.",
    startForFree: "Start For Free",
    seeFeatures: "See Features",
    noCreditCard: "No credit card required"
  };
  
  // Use translations if available, otherwise use defaults
  const getTranslation = (key: string) => {
    try {
      const translated = t(`hero.${key}`);
      return translated !== `hero.${key}` ? translated : defaultTexts[key as keyof typeof defaultTexts];
    } catch (err) {
      console.error(`Translation error for hero.${key}:`, err);
      return defaultTexts[key as keyof typeof defaultTexts];
    }
  };
  
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {getTranslation('tagline')}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            {getTranslation('title')}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {getTranslation('description')}
          </p>
          
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/auth?tab=register">
                {getTranslation('startForFree')}
                <ArrowRight className={`${isRtl ? 'mr-2 icon-flip-rtl' : 'ml-2'} h-4 w-4`} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="#features">
                {getTranslation('seeFeatures')}
              </Link>
            </Button>
          </div>
          
          <div className="pt-8 text-sm text-muted-foreground">
            <p>{getTranslation('noCreditCard')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
