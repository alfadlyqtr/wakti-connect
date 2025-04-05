
import React from "react";
import { useTranslation } from "react-i18next";

const DashboardPreview = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-6xl animate-fade-in">
        <div className="rounded-xl overflow-hidden border border-border shadow-xl bg-gradient-to-b from-background to-muted/50">
          <div className="w-full h-[500px] bg-grid-pattern flex items-center justify-center relative">
            {/* Dashboard Preview Image */}
            <img 
              src="/lovable-uploads/dashboard-preview.png" 
              alt={t('dashboardPreview.title')} 
              className="w-full h-full object-contain p-4"
              onError={(e) => {
                // If the image fails to load, show the fallback content
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = document.getElementById('dashboard-preview-fallback');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            
            {/* Fallback content if the image doesn't load */}
            <div 
              id="dashboard-preview-fallback" 
              className="absolute inset-0 flex flex-col items-center justify-center p-8" 
              style={{ display: 'none' }}
            >
              <h3 className="text-2xl font-medium mb-4">{t('dashboardPreview.title')}</h3>
              <p className="text-muted-foreground text-center">{t('dashboardPreview.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
