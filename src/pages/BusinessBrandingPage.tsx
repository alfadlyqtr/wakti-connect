
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BusinessBrandingPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Business Branding</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Customize Your Brand</CardTitle>
          <CardDescription>
            Update your business branding to create a consistent look and feel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Branding settings will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessBrandingPage;
