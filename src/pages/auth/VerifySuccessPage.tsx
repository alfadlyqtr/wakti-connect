
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const VerifySuccessPage = () => {
  const navigate = useNavigate();

  // Automatically redirect to dashboard after a delay
  useEffect(() => {
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
          <CardTitle className="text-2xl text-center">Email Verified</CardTitle>
          <CardDescription className="text-center">
            Your email has been successfully verified. You'll be redirected to your dashboard shortly.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="text-center">
            <p className="text-muted-foreground">
              Thank you for verifying your email address.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center gap-4">
          <Button 
            onClick={() => navigate("/dashboard")} 
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifySuccessPage;
