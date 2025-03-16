
import React from "react";

const DashboardPreview = () => {
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-6xl animate-fade-in">
        <div className="rounded-xl overflow-hidden border border-border shadow-xl bg-gradient-to-b from-background to-muted/50">
          <div className="w-full h-[500px] bg-grid-pattern flex items-center justify-center">
            <div className="text-center p-8">
              <h3 className="text-2xl font-medium mb-4">Dashboard Preview</h3>
              <p className="text-muted-foreground">Beautiful and intuitive interface designed for productivity</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
