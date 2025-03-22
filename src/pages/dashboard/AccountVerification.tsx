
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckIcon, XCircleIcon, MailIcon, AlertCircleIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AccountVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'error'>('pending');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [emailProvider, setEmailProvider] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          toast({
            title: "Not logged in",
            description: "Please log in to verify your account.",
            variant: "destructive"
          });
          return;
        }
        
        const user = sessionData.session.user;
        setUserEmail(user.email || null);
        
        // Check if the user's email is from a corporate domain
        if (user.email) {
          const domain = user.email.split('@')[1];
          const provider = domain.includes('gmail.com') ? 'gmail' : 
                        domain.includes('outlook.com') ? 'outlook' :
                        domain.includes('yahoo.com') ? 'yahoo' : 
                        'other';
          setEmailProvider(provider);
        }
        
        // Check verification status
        // In a real app, we'd check some verification flag in the user's metadata
        const metadata = user.user_metadata || {};
        
        if (metadata.email_verified === true) {
          setVerificationStatus('verified');
        } else {
          setVerificationStatus('pending');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch account information. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleSendVerification = async () => {
    setIsVerifying(true);
    try {
      // Mock sending a verification email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Verification Email Sent",
        description: `We've sent a verification email to ${userEmail}. Please check your inbox.`,
      });
      
      // In a real app, we'd actually send the email through Supabase
      // const { error } = await supabase.auth.resend({
      //   type: 'signup',
      //   email: userEmail
      // });
      
      // if (error) throw error;
    } catch (error) {
      console.error("Error sending verification:", error);
      toast({
        title: "Error",
        description: "Failed to send verification email. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleCheckVerification = async () => {
    setIsVerifying(true);
    try {
      // Mock checking verification status
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { data } = await supabase.auth.getUser();
      const appMetadata = data?.user?.app_metadata || {};
      const userMetadata = data?.user?.user_metadata || {};
      
      // In a real app, we'd check if the user's email is verified
      // This is just a mock implementation
      if (appMetadata.provider === 'email' && !userMetadata.email_verified) {
        setVerificationStatus('pending');
        toast({
          title: "Not Verified",
          description: "Your email hasn't been verified yet. Please check your inbox.",
          variant: "warning"
        });
      } else {
        setVerificationStatus('verified');
        toast({
          title: "Verified",
          description: "Your account has been successfully verified.",
        });
      }
    } catch (error) {
      console.error("Error checking verification:", error);
      toast({
        title: "Error",
        description: "Failed to check verification status. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="container max-w-lg py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Account Verification</CardTitle>
          <CardDescription>
            Verify your email address to access all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MailIcon className="h-5 w-5 text-muted-foreground" />
              <span>{userEmail || 'Loading...'}</span>
            </div>
            
            {verificationStatus === 'verified' ? (
              <div className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <CheckIcon className="h-3 w-3 mr-1" />
                Verified
              </div>
            ) : verificationStatus === 'pending' ? (
              <div className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <AlertCircleIcon className="h-3 w-3 mr-1" />
                Pending
              </div>
            ) : (
              <div className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <XCircleIcon className="h-3 w-3 mr-1" />
                Error
              </div>
            )}
          </div>
          
          <Separator />
          
          {verificationStatus === 'pending' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-amber-800">Verification Required</h3>
              <p className="text-xs text-amber-700 mt-1">
                To access all features of WAKTI, please verify your email address by clicking the link in the verification email.
              </p>
            </div>
          )}
          
          {verificationStatus === 'verified' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800">Account Verified</h3>
              <p className="text-xs text-green-700 mt-1">
                Your account has been verified. You now have full access to all features of WAKTI.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {verificationStatus === 'pending' && (
            <>
              <Button 
                variant="outline"
                onClick={handleCheckVerification}
                disabled={isVerifying}
              >
                Check Status
              </Button>
              <Button 
                onClick={handleSendVerification}
                disabled={isVerifying}
              >
                {isVerifying ? 'Sending...' : 'Resend Verification'}
              </Button>
            </>
          )}
          
          {verificationStatus === 'verified' && (
            <Button variant="outline" className="ml-auto" onClick={() => window.history.back()}>
              Back to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountVerification;
