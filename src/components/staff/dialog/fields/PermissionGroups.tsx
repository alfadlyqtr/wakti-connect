
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "../StaffFormSchema";
import { 
  ShieldCheck,
  List,
  MessageSquare,
  BarChart4
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PermissionCategoryTab from "./permission-tabs/PermissionCategoryTab";

interface PermissionGroupsProps {
  form: UseFormReturn<StaffFormValues>;
}

const PermissionGroups: React.FC<PermissionGroupsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ShieldCheck className="h-5 w-5 text-muted-foreground" />
        <h4 className="text-lg font-medium">Staff Permissions</h4>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg border border-muted">
        <p className="text-sm text-muted-foreground mb-4">
          Configure what this staff member can access and do within your business account. 
          Enabled permissions will appear with a green highlight.
        </p>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="tasks">Tasks & Work</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="business">Business Data</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <PermissionCategoryTab 
            form={form} 
            category="tasks"
            icon={List}
            title="Tasks & Work Management"
          />
        </TabsContent>
        
        <TabsContent value="communication">
          <PermissionCategoryTab 
            form={form} 
            category="communication"
            icon={MessageSquare}
            title="Communication & Bookings"
          />
        </TabsContent>
        
        <TabsContent value="business">
          <PermissionCategoryTab 
            form={form} 
            category="business"
            icon={BarChart4}
            title="Business Data & Analytics"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PermissionGroups;
