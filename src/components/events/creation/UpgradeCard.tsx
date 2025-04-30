
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UpgradeCard: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Upgrade Your Account</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p>Creating events requires an Individual or Business subscription.</p>
        <Button className="mt-2" onClick={() => window.location.href = '/dashboard/upgrade'}>
          Upgrade Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpgradeCard;
