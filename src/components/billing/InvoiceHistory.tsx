
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Receipt, ShieldCheck, Clock, AlertTriangle } from "lucide-react";
import { InvoiceType, BillingInfoType } from "./types";

interface InvoiceHistoryProps {
  invoices?: InvoiceType[];
  billingInfo?: BillingInfoType;
}

const InvoiceHistory = ({ invoices, billingInfo }: InvoiceHistoryProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>
          View and download your past invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        {billingInfo?.plan === "free" ? (
          <div className="text-center py-6">
            <Receipt className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">No Invoices</h3>
            <p className="text-muted-foreground">
              You haven't been charged yet as you're on the free plan.
            </p>
          </div>
        ) : invoices?.length === 0 ? (
          <div className="text-center py-6">
            <Receipt className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">No Invoices Yet</h3>
            <p className="text-muted-foreground">
              Your billing history will appear here once you've been charged.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices?.map((invoice) => (
              <div key={invoice.id} className="border rounded-md p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(invoice.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={
                    invoice.status === "paid" ? "outline" :
                    invoice.status === "pending" ? "secondary" :
                    "destructive"
                  }>
                    {invoice.status === "paid" ? (
                      <ShieldCheck className="h-3 w-3 mr-1" />
                    ) : invoice.status === "pending" ? (
                      <Clock className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                  <span className="font-medium">${invoice.amount.toFixed(2)}</span>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={invoice.downloadUrl} download>
                      <Receipt className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceHistory;
