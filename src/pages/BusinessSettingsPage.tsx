
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BusinessSettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Business Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Business Configuration</CardTitle>
          <CardDescription>
            Manage your business settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Business settings will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSettingsPage;
