
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
  isLoading?: boolean;
}

const DialogContent: React.FC<DialogContentProps> = ({
  form,
  isSubmitting,
  isEditing,
  activeTab,
  setActiveTab,
  handleSubmit,
  onCancel,
  error,
  isLoading
}) => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-1 overflow-hidden">
        <TabsList className="px-6 pt-6 bg-background sticky top-0 z-10">
          <TabsTrigger value="create" className="flex-1">Staff Information</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="flex-1 overflow-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading staff details...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <StaffFormFields form={form} isEditing={isEditing} />
              </form>
            </Form>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="border-t px-6 py-4 bg-background sticky bottom-0 flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isSubmitting || isLoading}
        >
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
    </div>
  );
};

export default DialogContent;
