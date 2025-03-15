
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const VerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);

  // Extract token from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    
    // If token exists, attempt to verify it
    if (token) {
      handleVerification(token);
    } else {
      // No token, just show the waiting for verification screen
      const emailFromState = location.state?.email;
      if (emailFromState) {
        setEmail(emailFromState);
      }
    }
  }, [location]);

  const handleVerification = async (token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (error) {
        throw error;
      }

      setVerificationStatus("success");
      
      // Redirect to dashboard after successful verification
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus("error");
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please provide your email address to resend verification.",
      });
      return;
    }

    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox for the verification link.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Resend",
        description: error.message || "Could not resend verification email. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto border-border/50 shadow-xl animate-in">
        <CardHeader>
          {verificationStatus === "verifying" && (
            <div className="mx-auto w-16 h-16 bg-wakti-blue/10 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="h-8 w-8 text-wakti-blue animate-spin" />
            </div>
          )}
          
          {verificationStatus === "success" && (
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 dark:bg-green-800/20">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          )}
          
          {verificationStatus === "error" && (
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 dark:bg-red-800/20">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          )}
          
          <CardTitle className="text-2xl text-center">
            {verificationStatus === "verifying" && "Verify Your Email"}
            {verificationStatus === "success" && "Email Verified"}
            {verificationStatus === "error" && "Verification Failed"}
          </CardTitle>
          
          <CardDescription className="text-center">
            {verificationStatus === "verifying" && "Please check your inbox and click the verification link."}
            {verificationStatus === "success" && "Your email has been successfully verified. Redirecting to dashboard..."}
            {verificationStatus === "error" && "We couldn't verify your email. The link may have expired or been used already."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {verificationStatus === "verifying" && (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                We've sent a verification link to{" "}
                <span className="font-medium text-foreground">
                  {email || "your email address"}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                If you don't see the email, check your spam folder or try requesting a new verification link.
              </p>
              
              <Button 
                onClick={handleResendVerification} 
                variant="outline" 
                disabled={isResending}
                className="mt-4"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Verification Link"
                )}
              </Button>
            </div>
          )}
          
          {verificationStatus === "success" && (
            <div className="text-center">
              <p className="text-muted-foreground">
                You'll be redirected to your dashboard shortly.
              </p>
            </div>
          )}
          
          {verificationStatus === "error" && (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Please try clicking the link from your email again or request a new verification link.
              </p>
              
              <Button 
                onClick={handleResendVerification} 
                variant="outline" 
                disabled={isResending}
                className="mt-4"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Verification Link"
                )}
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm text-muted-foreground">
            <Link to="/auth" className="text-wakti-blue hover:underline">
              Return to Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerificationPage;
