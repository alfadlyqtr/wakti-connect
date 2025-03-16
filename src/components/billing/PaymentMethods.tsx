
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { BillingInfoType } from "./types";

interface PaymentMethodsProps {
  billingInfo: BillingInfoType;
}

const PaymentMethods = ({ billingInfo }: PaymentMethodsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Manage your payment methods
        </CardDescription>
      </CardHeader>
      <CardContent>
        {billingInfo?.plan === "free" ? (
          <div className="text-center py-6">
            <CreditCard className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">No Payment Methods</h3>
            <p className="text-muted-foreground mb-4">
              You'll need to add a payment method when you upgrade to a paid plan.
            </p>
          </div>
        ) : (
          <div className="border rounded-md p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Badge>Default</Badge>
          </div>
        )}
      </CardContent>
      {billingInfo?.plan !== "free" && (
        <CardFooter>
          <Button variant="outline" size="sm">
            Update Payment Method
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PaymentMethods;
