
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PlanFeaturesList from "../PlanFeaturesList";

interface Feature {
  name: string;
  included: boolean;
}

interface FreePlanCardProps {
  features: Feature[];
}

const FreePlanCard = ({ features }: FreePlanCardProps) => {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Free
          <Badge variant="outline" className="ml-2">Current</Badge>
        </CardTitle>
        <CardDescription>For individuals just getting started</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">$0</span>
          <span className="text-muted-foreground">/forever</span>
        </div>
      </CardHeader>
      <CardContent className="h-[360px] overflow-y-auto">
        <PlanFeaturesList features={features} />
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" disabled>
          Current Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FreePlanCard;
