
import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BrandLogo from "@/components/layout/navbar/BrandLogo";

const StaffInvitationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [invitationData, setInvitationData] = useState<any>(null);
  
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("staff_invitations")
          .select("*, businesses:business_id(name, logo_url)")
          .eq("token", token)
          .eq("status", "pending")
          .single();
        
        if (error || !data) {
          console.error("Invalid invitation token:", error);
          setIsValid(false);
        } else {
          setInvitationData(data);
          setIsValid(true);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    validateToken();
  }, [token]);
  
  const acceptInvitation = async () => {
    setIsLoading(true);
    
    try {
      // First check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Store token in localStorage
        localStorage.setItem("pendingStaffInvitation", token!);
        // Redirect to signup
        navigate("/auth/signup");
        return;
      }
      
      // User is logged in, accept the invitation
      const { error } = await supabase
        .from("staff_invitations")
        .update({ status: "accepted" })
        .eq("token", token);
        
      if (error) {
        throw error;
      }
      
      // Create staff record
      await supabase.from("business_staff").insert({
        business_id: invitationData.business_id,
        staff_id: session.user.id,
        role: invitationData.role,
        status: "active",
        position: invitationData.position
      });
      
      toast({
        title: "Invitation accepted!",
        description: `You have joined ${invitationData.businesses.name} as ${invitationData.position}`,
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast({
        variant: "destructive",
        title: "Error accepting invitation",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-muted/30">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
          <p className="mt-2 text-muted-foreground">Verifying invitation...</p>
        </div>
      </div>
    );
  }
  
  if (!token) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Missing Invitation Token</CardTitle>
            <CardDescription className="text-center">
              No invitation token was provided in the URL.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <XCircle className="h-16 w-16 text-destructive" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link to="/">Go to Home Page</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (!isValid) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Invalid Invitation</CardTitle>
            <CardDescription className="text-center">
              This invitation is invalid, has expired, or has already been accepted.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <XCircle className="h-16 w-16 text-destructive" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link to="/">Go to Home Page</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BrandLogo />
          </div>
          <CardTitle className="text-2xl">Staff Invitation</CardTitle>
          <CardDescription>
            You've been invited to join {invitationData.businesses?.name || "a business"} as {invitationData.position || "staff member"}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm mb-1"><strong>Business:</strong> {invitationData.businesses?.name}</p>
            <p className="text-sm mb-1"><strong>Position:</strong> {invitationData.position}</p>
            <p className="text-sm"><strong>Role:</strong> {invitationData.role}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={acceptInvitation} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Accept Invitation
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/">
              Not Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StaffInvitationPage;
