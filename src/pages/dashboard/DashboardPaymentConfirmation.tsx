
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardPaymentConfirmation = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  
  // Auto-redirect to dashboard after countdown
  useEffect(() => {
    if (countdown <= 0) {
      navigate("/dashboard");
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, navigate]);
  
  return (
    <div className="max-w-xl mx-auto h-[calc(100vh-10rem)] flex items-center justify-center p-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            Thank you for your payment. Your subscription has been successfully processed and your account has been upgraded.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            <span>A receipt has been sent to your email address</span>
          </div>
          
          <div className="bg-muted p-4 rounded-lg my-4">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Plan:</span>
              <span className="font-medium">Business Plan</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">$29.99/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment method:</span>
              <span className="font-medium">Visa ending in 4242</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            You will be redirected to your dashboard in {countdown} seconds...
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate("/dashboard")}>
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardPaymentConfirmation;
