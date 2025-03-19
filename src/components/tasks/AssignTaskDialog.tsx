
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AssignTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  onAssign: (staffId: string) => Promise<boolean>;
}

export function AssignTaskDialog({ 
  open, 
  onOpenChange, 
  taskId, 
  onAssign 
}: AssignTaskDialogProps) {
  const { t } = useTranslation();
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch staff members
  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session");
      }
      
      // Get staff members
      const { data, error } = await supabase
        .from('business_staff')
        .select(`
          id,
          staff_id,
          name,
          position,
          profiles:staff_id (
            id,
            full_name,
            display_name,
            avatar_url
          )
        `)
        .eq('business_id', session.user.id);
        
      if (error) throw error;
      
      return data || [];
    },
    enabled: open,
  });

  const handleSubmit = async () => {
    if (!selectedStaff) return;
    
    setIsSubmitting(true);
    try {
      const success = await onAssign(selectedStaff);
      if (success) {
        setSelectedStaff("");
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('task.assignTask')}</DialogTitle>
          <DialogDescription>
            {t('task.assignTaskDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="staff" className="text-right">
              {t('staff.staffMember')}
            </Label>
            
            {isLoading ? (
              <div className="col-span-3 flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t('common.loading')}</span>
              </div>
            ) : staffMembers && staffMembers.length > 0 ? (
              <Select
                value={selectedStaff}
                onValueChange={setSelectedStaff}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('staff.selectStaffMember')} />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((staff: any) => (
                    <SelectItem key={staff.staff_id} value={staff.staff_id}>
                      {staff.name || (staff.profiles && 
                        (staff.profiles.display_name || staff.profiles.full_name))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="col-span-3 text-sm text-muted-foreground">
                {t('staff.noStaffFound')}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedStaff || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.assigning')}
              </>
            ) : (
              t('common.assign')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
