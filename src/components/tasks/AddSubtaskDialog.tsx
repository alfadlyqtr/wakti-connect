
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { addSubtask } from "@/services/task/taskService";

interface AddSubtaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  onSuccess: () => void;
}

export function AddSubtaskDialog({ 
  open, 
  onOpenChange, 
  taskId,
  onSuccess
}: AddSubtaskDialogProps) {
  const { t } = useTranslation();
  const [subtaskContent, setSubtaskContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!subtaskContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      const result = await addSubtask(taskId, subtaskContent);
      if (result) {
        setSubtaskContent("");
        onSuccess();
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
          <DialogTitle>{t('task.addSubtask')}</DialogTitle>
          <DialogDescription>
            {t('task.addSubtaskDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              id="subtask-content"
              placeholder={t('task.subtaskPlaceholder')}
              value={subtaskContent}
              onChange={(e) => setSubtaskContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isSubmitting) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!subtaskContent.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.adding')}
              </>
            ) : (
              t('common.add')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
