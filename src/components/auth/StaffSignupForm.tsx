
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, CheckCircle2, ArrowRightCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStaffInvitations } from "@/hooks/useStaffInvitations";

const staffSignupSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type StaffSignupFormValues = z.infer<typeof staffSignupSchema>;

const StaffSignupForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { verifyInvitation, acceptInvitation } = useStaffInvitations();
  
  const [invitation, setInvitation] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "valid" | "invalid">("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<StaffSignupFormValues>({
    resolver: zodResolver(staffSignupSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  // Verify the invitation token
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("invalid");
        return;
      }
      
      try {
        const invitation = await verifyInvitation.mutateAsync({ token });
        setInvitation(invitation);
        setStatus("valid");
      } catch (error) {
        console.error("Error verifying invitation:", error);
        setStatus("invalid");
      }
    };
    
    verifyToken();
  }, [token, verifyInvitation]);
  
  const onSubmit = async (values: StaffSignupFormValues) => {
    if (!invitation) return;
    
    setIsSubmitting(true);
    
    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitation.email,
        password: values.password,
        options: {
          data: {
            full_name: invitation.name,
            account_type: 'individual',
          }
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Failed to create user account");
      }
      
      // Accept the invitation and create staff record
      await acceptInvitation.mutateAsync({
        token,
        userId: authData.user.id
      });
      
      toast({
        title: "Account created successfully",
        description: "You can now log in to your staff account",
      });
      
      // Navigate to login
      navigate("/auth");
    } catch (error) {
      console.error("Error creating staff account:", error);
      toast({
        title: "Error creating account",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Loading state
  if (status === "loading") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-8 w-8 text-wakti-blue animate-spin mb-4" />
            <p className="text-center text-muted-foreground">Verifying your invitation...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Invalid token state
  if (status === "invalid" || !invitation) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Invalid Invitation</CardTitle>
          <CardDescription>
            This invitation link is invalid or has expired
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              The staff invitation link you used is invalid or has expired. Please contact your business administrator for a new invitation.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => navigate("/auth")}>
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Valid token, show signup form
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Staff Signup</CardTitle>
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Invitation Valid
          </Badge>
        </div>
        <CardDescription>
          Complete your staff account registration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 bg-muted p-4 rounded-md">
          <div className="font-medium">{invitation.name}</div>
          <div className="text-sm text-muted-foreground">{invitation.email}</div>
          <div className="text-sm mt-1">
            <span className="text-muted-foreground">Role: </span>
            <span className="font-medium">{invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}</span>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Complete Registration
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" onClick={() => navigate("/auth")}>
          Already have an account? Log in
          <ArrowRightCircle className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StaffSignupForm;
