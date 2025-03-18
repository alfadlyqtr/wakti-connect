
import React from "react";
import AccountVerificationTester from "@/components/testing/AccountVerificationTester";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AccountVerification = () => {
  const navigate = useNavigate();

  // Fetch auth session and profile data
  const { data } = useQuery({
    queryKey: ['verificationPageData'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return { session: null, profile: null };
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      return { session, profile };
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Account Verification</h1>
        <p className="text-muted-foreground">
          Verify account access controls, data isolation, and feature separation
        </p>
      </div>

      <div className="grid gap-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Testing Mode</AlertTitle>
          <AlertDescription>
            This page is for testing and verification purposes. It helps confirm that users only have access to features and data appropriate for their account type.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Current Session Information</CardTitle>
            <CardDescription>Details about your current user session</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.session ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Authentication</h3>
                  <p><span className="font-semibold">User ID:</span> {data.session.user.id}</p>
                  <p><span className="font-semibold">Email:</span> {data.session.user.email}</p>
                  <p><span className="font-semibold">Auth Provider:</span> {data.session.user.app_metadata.provider || 'email'}</p>
                </div>
                
                {data.profile && (
                  <div className="p-4 bg-muted rounded-md">
                    <h3 className="font-medium mb-2">Profile</h3>
                    <p><span className="font-semibold">Account Type:</span> {data.profile.account_type}</p>
                    <p><span className="font-semibold">Full Name:</span> {data.profile.full_name || 'Not set'}</p>
                    <p><span className="font-semibold">Display Name:</span> {data.profile.display_name || 'Not set'}</p>
                    {data.profile.account_type === 'business' && (
                      <p><span className="font-semibold">Business Name:</span> {data.profile.business_name || 'Not set'}</p>
                    )}
                  </div>
                )}
                
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Authenticated Session</AlertTitle>
                  <AlertDescription className="text-green-700">
                    You are currently logged in with a valid session.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>No Active Session</AlertTitle>
                  <AlertDescription>
                    You are not currently logged in. Please sign in to continue.
                  </AlertDescription>
                </Alert>
                
                <Button onClick={() => navigate('/auth/login')}>
                  Sign In
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <AccountVerificationTester />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Test: Navigate Dashboard</CardTitle>
              <CardDescription>
                Navigate to different dashboard sections to verify your account has the correct access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your account type ({data?.profile?.account_type || 'unknown'}) should only see features relevant to that account level.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Dashboard Home
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard/tasks')}>
                  Tasks
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard/events')}>
                  Events
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard/settings')}>
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Business Features Test</CardTitle>
              <CardDescription>
                Verify access to business-only features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                These pages should only be accessible if you have a business account. For other account types, you should see an upgrade prompt.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => navigate('/dashboard/business-page')}>
                  Business Page
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard/services')}>
                  Services
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard/staff')}>
                  Staff
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard/bookings')}>
                  Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountVerification;
