import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AuthErrorState from "@/components/auth/AuthErrorState";

const AccountVerification = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [provider, setProvider] = useState<string>('email');

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        setIsLoading(true);
        
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          setError("No active session found. Please log in again.");
          setIsLoading(false);
          return;
        }
        
        // Fetch user profile data to check verification status
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*');
          
        if (!profileData || profileData.length === 0) {
          setError("User profile not found.");
          setIsLoading(false);
          return;
        }
        
        const userProfile = profileData[0];
        
        // Set email for display
        setEmail(sessionData.session.user.email);
        
        // Set provider (OAuth or email)
        const providerName = sessionData.session?.user?.app_metadata?.provider || 'email';
        setProvider(providerName);
        
        // Check if account is verified
        if (provider === 'google' || provider === 'facebook' || userProfile.email_verified) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
        
      } catch (error: any) {
        console.error("Error checking verification status:", error);
        setError(error.message || "Failed to check verification status");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkVerificationStatus();
  }, [provider]);
  
  const handleResendVerification = async () => {
    try {
      if (!email) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Email address not found",
        });
        return;
      }
      
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (resendError) throw resendError;
      
      toast({
        title: "Verification email sent",
        description: `A new verification email has been sent to ${email}`,
      });
      
    } catch (error: any) {
      console.error("Error resending verification:", error);
      toast({
        variant: "destructive",
        title: "Failed to resend verification",
        description: error.message || "An error occurred while resending the verification email",
      });
    }
  };
  
  if (error) {
    return <AuthErrorState authError={error} />;
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">Account Verification</h1>
      
      {isVerified ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-6">
          <h2 className="text-green-700 font-medium">Your account is verified!</h2>
          <p className="text-green-600 mt-2">
            You have full access to all features on WAKTI.
          </p>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-6">
          <h2 className="text-amber-700 font-medium">Your account is not verified</h2>
          <p className="text-amber-600 mt-2">
            Please check your email ({email}) and click the verification link we sent you.
          </p>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={handleResendVerification}
              className="w-full"
            >
              Resend Verification Email
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Why verify your account?</h3>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Secure your account from unauthorized access</li>
          <li>Gain access to all WAKTI features</li>
          <li>Receive important notifications and updates</li>
          <li>Connect with other WAKTI users</li>
        </ul>
      </div>
    </div>
  );
};

export default AccountVerification;
