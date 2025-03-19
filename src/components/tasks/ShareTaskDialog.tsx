
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

interface ShareTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  onShare: (contactId: string) => Promise<boolean>;
}

export function ShareTaskDialog({ 
  open, 
  onOpenChange, 
  taskId, 
  onShare 
}: ShareTaskDialogProps) {
  const { t } = useTranslation();
  const [selectedContact, setSelectedContact] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch user contacts
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session");
      }
      
      // Get accepted contacts
      const { data, error } = await supabase
        .from('user_contacts')
        .select(`
          id,
          contact_id,
          profiles:contact_id (
            id,
            full_name,
            display_name,
            avatar_url
          )
        `)
        .eq('user_id', session.user.id)
        .eq('status', 'accepted');
        
      if (error) throw error;
      
      return data || [];
    },
    enabled: open,
  });

  const handleSubmit = async () => {
    if (!selectedContact) return;
    
    setIsSubmitting(true);
    try {
      const success = await onShare(selectedContact);
      if (success) {
        setSelectedContact("");
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
          <DialogTitle>{t('task.shareTask')}</DialogTitle>
          <DialogDescription>
            {t('task.shareTaskDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">
              {t('contacts.contact')}
            </Label>
            
            {isLoading ? (
              <div className="col-span-3 flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t('common.loading')}</span>
              </div>
            ) : contacts && contacts.length > 0 ? (
              <Select
                value={selectedContact}
                onValueChange={setSelectedContact}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('contacts.selectContact')} />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact: any) => (
                    <SelectItem key={contact.contact_id} value={contact.contact_id}>
                      {contact.profiles.display_name || contact.profiles.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="col-span-3 text-sm text-muted-foreground">
                {t('contacts.noContactsFound')}
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
            disabled={!selectedContact || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.sharing')}
              </>
            ) : (
              t('common.share')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
