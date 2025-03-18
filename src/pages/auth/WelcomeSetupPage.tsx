
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const WelcomeSetupPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto border-border/50 shadow-xl animate-in">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to WAKTI</CardTitle>
          <CardDescription className="text-center">
            Let's get your account set up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground">
              Choose a plan to get started with WAKTI
            </p>
          </div>
          <div className="grid gap-4">
            <Button onClick={() => navigate("/auth/plans")}>
              Select a Plan
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeSetupPage;
