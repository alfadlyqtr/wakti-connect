
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingCardsGrid } from "@/components/pricing/PricingCardsGrid";

const PlanSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full p-4 space-y-8">
      <Card className="mx-auto max-w-4xl border-border/50 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Choose Your Plan</CardTitle>
          <CardDescription>
            Select the plan that best fits your needs
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <PricingCardsGrid />
          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanSelectionPage;
