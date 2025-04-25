
import React, { useState, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAISettings } from "@/hooks/ai/settings";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface RoleProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RoleProfileDialog: React.FC<RoleProfileDialogProps> = ({ open, onOpenChange }) => {
  const { settings, updateSettings } = useAISettings();
  // Using optional chaining to safely access the profile property
  const [profile, setProfile] = useState(settings?.profile || "");
  const [isSaving, setIsSaving] = useState(false);
  
  const handleProfileChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfile(e.target.value);
  }, []);
  
  const updatedSettings = {
    ...settings,
    profile: profile,
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(updatedSettings);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save AI settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>AI Role Profile</AlertDialogTitle>
          <AlertDialogDescription>
            Customize the AI's behavior by providing a detailed role profile.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roleProfile" className="text-right">
              Role Profile
            </Label>
            <Textarea
              id="roleProfile"
              value={profile}
              onChange={handleProfileChange}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave} disabled={isSaving} className={cn(isSaving ? "cursor-not-allowed" : "")}>
            {isSaving ? "Saving..." : "Save"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RoleProfileDialog;
