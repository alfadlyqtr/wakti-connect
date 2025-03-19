import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, AlertCircle, Loader2, Mail, Lock, Building } from "lucide-react";
import { getStaffInvitationByToken, updateStaffInvitationStatus } from "@/services/staff/staffInvitationService";
import { supabase } from "@/integrations/supabase/client";
import { format, isAfter } from "date-fns";
import BrandLogo from "@/components/layout/navbar/BrandLogo";

const StaffInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<any | null>(null);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  useEffect(() => {
    const fetchInvitation = async () => {
      if (!token) {
        setError("Invalid invitation link. No token provided.");
        setIsLoading(false);
        return;
      }
      
      try {
        const invitationData = await getStaffInvitationByToken(token);
        
        if (!invitationData) {
          setError("Invitation not found or has been deleted.");
          setIsLoading(false);
          return;
        }
        
        if (!isAfter(new Date(invitationData.expires_at), new Date())) {
          setError("This invitation has expired.");
          setIsLoading(false);
          return;
        }
        
        if (invitationData.status === "accepted") {
          setError("This invitation has already been accepted.");
          setIsLoading(false);
          return;
        }
        
        setInvitation(invitationData);
        setEmail(invitationData.email);
        setFullName(invitationData.name);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error fetching invitation:", err);
        setError(err.message || "Failed to load invitation");
        setIsLoading(false);
      }
    };
    
    fetchInvitation();
  }, [token]);
  
  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAccepting(true);
    
    try {
      if (!invitation) {
        throw new Error("Invitation data is missing");
      }
      
      if (email.toLowerCase() !== invitation.email.toLowerCase()) {
        throw new Error("The email address doesn't match the invitation");
      }
      
      const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (existingUser?.user) {
        const { error: staffError } = await supabase
          .from('business_staff')
          .insert({
            business_id: invitation.business_id,
            staff_id: existingUser.user.id,
            name: fullName,
            email: email,
            position: invitation.position,
            role: invitation.role,
            status: 'active',
          });
          
        if (staffError) throw staffError;
        
        await updateStaffInvitationStatus(invitation.id, "accepted");
        
        await supabase.auth.signInWithPassword({ email, password });
        navigate("/dashboard");
        return;
      }
      
      if (checkError?.message !== "Invalid login credentials") {
        throw checkError;
      }
      
      const { data: newUser, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            account_type: "staff",
          },
        },
      });
      
      if (signupError) throw signupError;
      
      if (!newUser?.user) {
        throw new Error("Failed to create account");
      }
      
      const { error: staffError } = await supabase
        .from('business_staff')
        .insert({
          business_id: invitation.business_id,
          staff_id: newUser.user.id,
          name: fullName,
          email: email,
          position: invitation.position,
          role: invitation.role,
          status: 'active',
        });
        
      if (staffError) throw staffError;
      
      await updateStaffInvitationStatus(invitation.id, "accepted");
      
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Error accepting invitation:", err);
      setError(err.message || "Failed to accept invitation");
      setIsAccepting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2">Loading invitation...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-6">
              <BrandLogo />
            </div>
            <CardTitle className="text-center">Staff Invitation</CardTitle>
            <CardDescription className="text-center">
              There was a problem with your invitation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth/login")}
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <BrandLogo />
          </div>
          <CardTitle className="text-center">Accept Staff Invitation</CardTitle>
          <CardDescription className="text-center">
            You've been invited to join{" "}
            <span className="font-medium">{invitation?.businessName || "a business"}</span>{" "}
            as {invitation?.role === "co-admin" ? "a Co-Admin" : invitation?.role === "admin" ? "an Admin" : "a Staff Member"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 border p-3 rounded-md bg-muted/50">
            <div>
              <span className="font-medium">Invitation Details:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div>Name:</div>
              <div className="font-medium">{invitation?.name}</div>
              
              <div>Email:</div>
              <div className="font-medium">{invitation?.email}</div>
              
              <div>Role:</div>
              <div className="font-medium capitalize">{invitation?.role}</div>
              
              {invitation?.position && (
                <>
                  <div>Position:</div>
                  <div className="font-medium">{invitation?.position}</div>
                </>
              )}
              
              <div>Sent:</div>
              <div className="font-medium">
                {invitation ? format(new Date(invitation.created_at), "PPp") : ""}
              </div>
              
              <div>Expires:</div>
              <div className="font-medium">
                {invitation ? format(new Date(invitation.expires_at), "PPp") : ""}
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="signup">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signup">Create Account</TabsTrigger>
              <TabsTrigger value="login">Already Have an Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signup">
              <form onSubmit={handleAcceptInvitation} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="full-name" 
                      type="text" 
                      placeholder="Your Full Name" 
                      className="pl-10"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="email@example.com" 
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This must match the email address the invitation was sent to.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Create Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isAccepting}>
                  {isAccepting ? (
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Accept Invitation
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="login">
              <form onSubmit={handleAcceptInvitation} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="email-login" 
                      type="email" 
                      placeholder="email@example.com" 
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This must match the email address the invitation was sent to.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-login">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="password-login" 
                      type="password" 
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isAccepting}>
                  {isAccepting ? (
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Accepting Invitation...</span>
                    </div>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Accept With Existing Account
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => navigate("/auth/login")}
          >
            Return to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StaffInvitationPage;
