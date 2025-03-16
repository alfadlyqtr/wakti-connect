import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Form schema for profile
const profileFormSchema = z.object({
  full_name: z.string().optional(),
  display_name: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }).optional(),
  business_name: z.string().optional(),
  occupation: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Define profile type to ensure TypeScript knows about our new columns
interface ProfileData {
  id: string;
  full_name: string | null;
  display_name: string | null;
  business_name: string | null;
  occupation: string | null;
  account_type: "free" | "individual" | "business";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  is_searchable: boolean | null;
  theme_preference: string | null;
}

const DashboardProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profileDetails'],
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
      
      return data as ProfileData;
    },
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', session.user.id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profileDetails'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['sidebarProfile'] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Setup form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      display_name: profile?.display_name || "",
      business_name: profile?.business_name || "",
      occupation: profile?.occupation || "",
    },
  });

  // Reset form when profile data changes
  React.useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || "",
        display_name: profile.display_name || "",
        business_name: profile.business_name || "",
        occupation: profile.occupation || "",
      });
    }
  }, [profile, form]);

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile.mutate(values);
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    const name = profile?.display_name || profile?.full_name || "";
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-wakti-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          View and update your profile information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-3 pb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
                <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-medium">{profile?.display_name || profile?.full_name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{profile?.account_type} Account</p>
              </div>
            </div>

            {!isEditing ? (
              // Display mode
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Full Name</h4>
                    <p>{profile?.full_name || "Not set"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Display Name</h4>
                    <p>{profile?.display_name || "Not set"}</p>
                  </div>
                  {profile?.account_type === "business" && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Business Name</h4>
                      <p>{profile?.business_name || "Not set"}</p>
                    </div>
                  )}
                  {profile?.account_type !== "business" && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Occupation</h4>
                      <p>{profile?.occupation || "Not set"}</p>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="w-full"
                >
                  Edit Profile
                </Button>
              </div>
            ) : (
              // Edit mode
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="display_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="How you want to be addressed" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {profile?.account_type === "business" && (
                    <FormField
                      control={form.control}
                      name="business_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your business name" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {profile?.account_type !== "business" && (
                    <FormField
                      control={form.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation</FormLabel>
                          <FormControl>
                            <Input placeholder="Your occupation or job title" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={updateProfile.isPending}
                    >
                      {updateProfile.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Your account information and subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Account Type</h4>
                <div className="flex items-center mt-1">
                  <p className="capitalize font-medium">{profile?.account_type}</p>
                  {profile?.account_type === "free" && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-wakti-gold/10 px-2 py-1 text-xs font-medium text-wakti-gold">
                      Free
                    </span>
                  )}
                  {profile?.account_type === "individual" && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-wakti-blue/10 px-2 py-1 text-xs font-medium text-wakti-blue">
                      Individual
                    </span>
                  )}
                  {profile?.account_type === "business" && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                      Business
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Email Address</h4>
                <p>{profile?.id || "Not available"}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Account Created</h4>
                <p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Not available"}</p>
              </div>

              {profile?.account_type === "free" && (
                <Button 
                  className="w-full mt-4"
                  variant="default"
                  onClick={() => window.location.href = "/dashboard/upgrade"}
                >
                  Upgrade Account
                </Button>
              )}

              <Button 
                className="w-full mt-2"
                variant="outline"
                onClick={() => window.location.href = "/dashboard/billing"}
              >
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardProfile;
