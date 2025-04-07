
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
import StaffFormFields from "./StaffFormFields";
import { StaffFormValues } from "./StaffFormSchema";
import { useTranslation } from "react-i18next";

interface CreateTabProps {
  form: UseFormReturn<StaffFormValues>;
  onSubmit: (values: StaffFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CreateTab: React.FC<CreateTabProps> = ({ 
  form, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}) => {
  const { t } = useTranslation();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 h-full flex flex-col">
        <div className="sticky top-0 z-10 bg-background pt-4 pb-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{t("staff.createNewStaff")}</h3>
              <p className="text-sm text-muted-foreground">{t("staff.setupDetails")}</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2">
          <StaffFormFields form={form} />
        </div>
        
        <DialogFooter className="mt-6 pt-4 border-t sticky bottom-0 bg-background">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="mr-2"
            disabled={isSubmitting}
          >
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("staff.creating")}
              </>
            ) : (
              t("staff.createStaffAccount")
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CreateTab;
