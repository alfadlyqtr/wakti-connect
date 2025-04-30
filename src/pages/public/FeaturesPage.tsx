
import React from "react";
import { Shell } from "@/components/shells/shell";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { PageTitle } from "@/components/marketing/page-title";

const FeaturesPage = () => {
  return (
    <Shell>
      <Section>
        <Container>
          <PageTitle
            title="Features"
            subtitle="Discover what makes our platform stand out"
          />
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-10">
            {/* Feature cards will go here */}
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">Feature Coming Soon</h3>
              <p className="text-muted-foreground">
                Our event features are currently being rebuilt to provide you with an even better experience.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">Stay Tuned</h3>
              <p className="text-muted-foreground">
                Check back soon for our enhanced event management system.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">More to Come</h3>
              <p className="text-muted-foreground">
                We're working on exciting new features that will be available shortly.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </Shell>
  );
};

export default FeaturesPage;
