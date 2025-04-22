
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Shield, ShieldAlert, Lock, Unlock, Clock, RotateCcw, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PasswordVerificationDialog } from "./PasswordVerificationDialog";
import { FeatureConfirmationDialog } from "./FeatureConfirmationDialog";
import { AuditLogDisplay } from "./AuditLogDisplay";

// Types for our feature lock
interface FeatureLock {
  id: string;
  feature_name: string;
  status: "locked" | "unlocked";
  locked_at: string | null;
  locked_by: string | null;
  updated_at: string;
}

// Types for user information
interface UserInfo {
  id: string;
  email: string;
  full_name: string | null;
}

const FeatureControlsPage = () => {
  // State for dialogs
  const [selectedFeature, setSelectedFeature] = useState<FeatureLock | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"lock" | "unlock">("lock");
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Fetch feature locks data
  const { data: featureLocks, isLoading: isLoadingLocks, refetch: refetchLocks } = useQuery({
    queryKey: ["feature-locks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_locks")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as FeatureLock[];
    },
  });

  // Fetch user mapping for display purposes
  const { data: userMap } = useQuery({
    queryKey: ["superadmin-users-map"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name");

      if (error) throw error;

      // Create a map for quick lookups
      const map = new Map();
      data?.forEach((user) => {
        map.set(user.id, user.full_name || "Unknown User");
      });
      return map;
    },
  });

  // Handle opening the lock/unlock dialogs
  const handleFeatureAction = (feature: FeatureLock, action: "lock" | "unlock") => {
    setSelectedFeature(feature);
    setActionType(action);
    setIsConfirmDialogOpen(true);
  };

  // Confirm action before password input
  const handleConfirmAction = () => {
    setIsConfirmDialogOpen(false);
    setIsPasswordDialogOpen(true);
  };

  // Process the locking or unlocking with password
  const handleFeatureActionWithPassword = async (password: string) => {
    if (!selectedFeature) return;

    setIsLoadingAction(true);
    try {
      let functionToCall = actionType === "lock" ? "lock_feature" : "unlock_feature";
      
      const { data, error } = await supabase.rpc(functionToCall, {
        feature_name_param: selectedFeature.feature_name,
        password_attempt: password
      });

      if (error) throw error;

      if (data) {
        toast.success(
          `Feature ${selectedFeature.feature_name} ${actionType === "lock" ? "locked" : "unlocked"} successfully`
        );
        refetchLocks();
      } else {
        toast.error("Invalid password or insufficient permissions");
      }
    } catch (error) {
      console.error("Error during feature action:", error);
      toast.error("There was an error processing your request");
    } finally {
      setIsLoadingAction(false);
      setIsPasswordDialogOpen(false);
      setSelectedFeature(null);
    }
  };

  // Get status badge based on lock status
  const getStatusBadge = (status: string) => {
    if (status === "locked") {
      return (
        <Badge variant="destructive" className="gap-1">
          <Lock className="h-3 w-3" /> Locked
        </Badge>
      );
    }
    return (
      <Badge variant="success" className="gap-1 bg-green-600">
        <Unlock className="h-3 w-3" /> Unlocked
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-bold text-white">Feature Controls</h1>
        </div>
        <Button 
          onClick={() => refetchLocks()} 
          variant="outline" 
          size="sm"
          className="text-gray-400 flex items-center gap-1"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-500" />
            Feature Lock Status
          </CardTitle>
          <CardDescription>
            Control access to specific features by locking or unlocking them. Locked features will be inaccessible to users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingLocks ? (
            <div className="text-center py-4 text-gray-400">Loading feature locks...</div>
          ) : !featureLocks?.length ? (
            <div className="text-center py-4 text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <AlertTriangle className="h-10 w-10 text-amber-500 opacity-60" />
                <p>No feature locks found. Add features to control their access.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-gray-800/50">
                    <TableHead className="text-gray-400">Feature Name</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Last Modified</TableHead>
                    <TableHead className="text-gray-400">Modified By</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {featureLocks.map((feature) => (
                    <TableRow key={feature.id} className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell className="font-medium">
                        {feature.feature_name}
                      </TableCell>
                      <TableCell>{getStatusBadge(feature.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="h-3 w-3" />
                          {new Date(feature.updated_at).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {feature.locked_by 
                          ? (userMap?.get(feature.locked_by) || "Unknown User") 
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {feature.status === "locked" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFeatureAction(feature, "unlock")}
                            className="bg-gray-800 hover:bg-gray-700 text-green-400 hover:text-green-300 border-gray-700"
                          >
                            <Unlock className="h-4 w-4 mr-1" /> Unlock
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFeatureAction(feature, "lock")}
                            className="bg-gray-800 hover:bg-gray-700 text-amber-400 hover:text-amber-300 border-gray-700"
                          >
                            <Lock className="h-4 w-4 mr-1" /> Lock
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AuditLogDisplay />

      {/* Confirmation Dialog */}
      <FeatureConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleConfirmAction}
        feature={selectedFeature?.feature_name || ""}
        actionType={actionType}
      />

      {/* Password Verification Dialog */}
      <PasswordVerificationDialog
        isOpen={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        onVerify={handleFeatureActionWithPassword}
        feature={selectedFeature?.feature_name || ""}
        actionType={actionType}
        isLoading={isLoadingAction}
      />
    </div>
  );
};

export default FeatureControlsPage;
