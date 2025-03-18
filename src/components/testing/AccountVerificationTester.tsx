
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { accountTypeVerification } from "@/utils/accountTypeVerification";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AccountVerificationTester = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<Record<string, boolean | null>>({
    accountType: null,
    taskIsolation: null,
    eventIsolation: null,
    businessFeatures: null
  });

  // Fetch current user profile
  const { data: profileData } = useQuery({
    queryKey: ['testUserProfile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      return data;
    },
  });

  const runTests = async () => {
    setIsRunning(true);
    setResults({
      accountType: null,
      taskIsolation: null,
      eventIsolation: null,
      businessFeatures: null
    });

    try {
      // Run tests one by one for better visibility
      const accountType = await accountTypeVerification.verifyAccountType(
        profileData?.account_type as 'free' | 'individual' | 'business'
      );
      setResults(prev => ({ ...prev, accountType }));
      
      const taskIsolation = await accountTypeVerification.verifyTaskIsolation();
      setResults(prev => ({ ...prev, taskIsolation }));
      
      const eventIsolation = await accountTypeVerification.verifyEventIsolation();
      setResults(prev => ({ ...prev, eventIsolation }));
      
      const businessFeatures = await accountTypeVerification.verifyBusinessFeatureAccess();
      setResults(prev => ({ ...prev, businessFeatures }));
    } catch (error) {
      console.error("Error running tests:", error);
    } finally {
      setIsRunning(false);
    }
  };

  // Get status indicator color
  const getStatusColor = (result: boolean | null) => {
    if (result === null) return "bg-gray-300";
    return result ? "bg-green-500" : "bg-red-500";
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Account Verification Test</CardTitle>
        <CardDescription>
          Test account type and data isolation for the current user
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profileData && (
          <div className="p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">Current User</h3>
            <p><span className="font-semibold">ID:</span> {profileData.id}</p>
            <p><span className="font-semibold">Account Type:</span> {profileData.account_type}</p>
            <p><span className="font-semibold">Name:</span> {profileData.full_name || 'Not set'}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="font-medium">Test Results</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Account Type Verification:</span>
              <div className={`h-3 w-3 rounded-full ${getStatusColor(results.accountType)}`}></div>
            </div>
            <div className="flex items-center justify-between">
              <span>Task Isolation:</span>
              <div className={`h-3 w-3 rounded-full ${getStatusColor(results.taskIsolation)}`}></div>
            </div>
            <div className="flex items-center justify-between">
              <span>Event Isolation:</span>
              <div className={`h-3 w-3 rounded-full ${getStatusColor(results.eventIsolation)}`}></div>
            </div>
            <div className="flex items-center justify-between">
              <span>Business Feature Access:</span>
              <div className={`h-3 w-3 rounded-full ${getStatusColor(results.businessFeatures)}`}></div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={runTests} disabled={isRunning} className="w-full">
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run Verification Tests'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountVerificationTester;
