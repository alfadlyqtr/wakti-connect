
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "./StaffFormSchema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { StaffFormFields } from "./index";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DialogContentProps {
  form: UseFormReturn<StaffFormValues>;
  isSubmitting: boolean;
  isEditing: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSubmit: (values: StaffFormValues) => Promise<void>;
  onCancel: () => void;
  error?: string | null;
}

const DialogContent: React.FC<DialogContentProps> = ({
  form,
  isSubmitting,
  isEditing,
  activeTab,
  setActiveTab,
  handleSubmit,
  onCancel,
  error
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="create">Staff Information</TabsTrigger>
      </TabsList>
      
      <TabsContent value="create" className="space-y-4 py-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <StaffFormFields form={form} isEditing={isEditing} />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEditing ? "Update Staff" : "Create Staff"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};

export default DialogContent;
