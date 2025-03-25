
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet } from "lucide-react";
import { BillingInfoType } from "./types";

interface PaymentMethodsProps {
  billingInfo: BillingInfoType;
}

const PaymentMethods = ({ billingInfo }: PaymentMethodsProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<"card" | "paypal">("card");
  
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
          <div className="space-y-4">
            <RadioGroup 
              value={selectedPaymentMethod} 
              onValueChange={(value) => setSelectedPaymentMethod(value as "card" | "paypal")} 
              className="space-y-3"
            >
              <div className="border rounded-md p-4 flex items-center space-x-3">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-muted-foreground">Visa ending in 4242</p>
                  </div>
                </Label>
                <Badge>Default</Badge>
              </div>
              
              <div className="border rounded-md p-4 flex items-center space-x-3">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-3 cursor-pointer">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-muted-foreground">Connected to your PayPal account</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
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
