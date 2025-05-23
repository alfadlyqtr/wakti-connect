
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto border-border/50 shadow-xl animate-in">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 dark:bg-green-800/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-center">{t("payment.paymentSuccess")}</CardTitle>
          <CardDescription className="text-center">
            {t("payment.subscriptionActive")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              {t("payment.redirectMessage")}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate("/dashboard")}>
            {t("verification.goToDashboard")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
