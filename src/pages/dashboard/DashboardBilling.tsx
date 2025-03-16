
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useBillingInfo from "@/hooks/useBillingInfo";
import BillingInfo from "@/components/billing/BillingInfo";
import PlanSelection from "@/components/billing/PlanSelection";
import PaymentMethods from "@/components/billing/PaymentMethods";
import InvoiceHistory from "@/components/billing/InvoiceHistory";

const DashboardBilling = () => {
  const [selectedPlan, setSelectedPlan] = useState<"individual" | "business" | null>(null);
  const { billingInfo, invoices, isLoading } = useBillingInfo();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription plan and billing information.
        </p>
      </div>
      
      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription" className="space-y-4 mt-4">
          {billingInfo && (
            <>
              <BillingInfo billingInfo={billingInfo} isLoading={isLoading} />
              
              {billingInfo.plan === "free" && (
                <PlanSelection 
                  selectedPlan={selectedPlan} 
                  setSelectedPlan={setSelectedPlan} 
                />
              )}
              
              <PaymentMethods billingInfo={billingInfo} />
            </>
          )}
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4 mt-4">
          <InvoiceHistory invoices={invoices} billingInfo={billingInfo} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardBilling;
