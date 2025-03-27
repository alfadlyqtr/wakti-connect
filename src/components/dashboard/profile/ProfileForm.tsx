
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStaffPermissions } from "@/hooks/useStaffPermissions";

// Form schema for profile
const profileFormSchema = z.object({
  full_name: z.string().optional(),
  display_name: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }).optional(),
  business_name: z.string().optional().refine(value => {
    // Business name is required for business accounts
    return true; // This will be checked in the onSubmit handler
  }),
  occupation: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  form: UseFormReturn<ProfileFormValues>;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onSubmit: (values: ProfileFormValues) => void;
  profile: {
    account_type: "free" | "individual" | "business";
    full_name: string | null;
    display_name: string | null;
    business_name: string | null;
    occupation: string | null;
  } | undefined;
  updateProfile: {
    isPending: boolean;
  };
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  form,
  isEditing,
  setIsEditing,
  onSubmit,
  profile,
  updateProfile
}) => {
  const { isStaff } = useStaffPermissions();

  if (!isEditing) {
    // Display mode
    return (
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
        {!isStaff && (
          <Button 
            onClick={() => setIsEditing(true)}
            className="w-full"
          >
            Edit Profile
          </Button>
        )}
      </div>
    );
  }

  // Edit mode - Staff should never reach this state
  if (isStaff) {
    return (
      <Alert variant="warning" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Staff members cannot edit profile information. Please contact your administrator.
        </AlertDescription>
      </Alert>
    );
  }

  // Edit mode for non-staff
  return (
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
                <FormLabel>Business Name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Your business name" {...field} value={field.value || ''} required />
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
            disabled={profile?.account_type === 'business' && !profile?.business_name}
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
  );
};

export default ProfileForm;
