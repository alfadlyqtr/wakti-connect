
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, CheckCircle, XCircle, Eye, EyeOff, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AuditLogEntry {
  id: string;
  feature_name: string;
  action: string;
  success: boolean;
  user_id: string;
  ip_address: string;
  created_at: string;
}

export const AuditLogDisplay: React.FC = () => {
  // State for the logs
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterFeature, setFilterFeature] = useState<string>("");
  const [maxEntries, setMaxEntries] = useState<number>(10);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Fetch audit logs
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ["feature-audit-logs", maxEntries],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feature_lock_audits")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(maxEntries);

      if (error) throw error;
      return data as AuditLogEntry[];
    },
  });

  // Fetch user info for display
  const { data: userMap } = useQuery({
    queryKey: ["superadmin-users-map-audit"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email");

      if (error) throw error;

      // Create maps for quick lookups
      const nameMap = new Map();
      const emailMap = new Map();
      
      data?.forEach((user) => {
        nameMap.set(user.id, user.full_name || "Unknown");
        emailMap.set(user.id, user.email || "");
      });
      
      return { nameMap, emailMap };
    },
  });

  // Filter the logs
  const filteredLogs = React.useMemo(() => {
    if (!auditLogs) return [];
    
    return auditLogs.filter(log => {
      const actionMatch = filterAction === "all" || log.action === filterAction;
      const featureMatch = !filterFeature || log.feature_name.toLowerCase().includes(filterFeature.toLowerCase());
      return actionMatch && featureMatch;
    });
  }, [auditLogs, filterAction, filterFeature]);

  // Function to export logs as CSV
  const exportLogs = () => {
    if (!filteredLogs.length) return;
    
    const headers = ["Feature", "Action", "Status", "User", "IP Address", "Timestamp"];
    
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map(log => [
        log.feature_name,
        log.action,
        log.success ? "Success" : "Failed",
        userMap?.nameMap.get(log.user_id) || "Unknown",
        log.ip_address || "Unknown",
        new Date(log.created_at).toLocaleString()
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `feature_audit_log_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to render the status badge
  const getStatusBadge = (success: boolean) => {
    if (success) {
      return (
        <Badge variant="success" className="bg-green-600">
          <CheckCircle className="h-3 w-3 mr-1" /> Success
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" /> Failed
      </Badge>
    );
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Feature Control Audit Log
          </CardTitle>
          <CardDescription>
            Track all feature lock and unlock attempts and actions
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-gray-400 border-gray-700"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" /> Show Less
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" /> Show More
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-400 border-gray-700"
            onClick={exportLogs}
            disabled={!filteredLogs.length}
          >
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Select
              value={filterAction}
              onValueChange={setFilterAction}
            >
              <SelectTrigger className="w-[130px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="validation">Validation</SelectItem>
                <SelectItem value="lock">Lock</SelectItem>
                <SelectItem value="unlock">Unlock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Input
            placeholder="Filter by feature name"
            value={filterFeature}
            onChange={(e) => setFilterFeature(e.target.value)}
            className="w-[200px] bg-gray-800 border-gray-700 text-white"
          />
          
          <Select
            value={maxEntries.toString()}
            onValueChange={(value) => setMaxEntries(parseInt(value))}
          >
            <SelectTrigger className="w-[110px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Show entries" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="10">10 Entries</SelectItem>
              <SelectItem value="25">25 Entries</SelectItem>
              <SelectItem value="50">50 Entries</SelectItem>
              <SelectItem value="100">100 Entries</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-4 text-gray-400">Loading audit logs...</div>
        ) : !filteredLogs.length ? (
          <div className="text-center py-4 text-gray-400">No matching audit logs found</div>
        ) : (
          <ScrollArea className={isExpanded ? "h-[500px]" : "h-[300px]"}>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  <TableHead className="text-gray-400">Feature</TableHead>
                  <TableHead className="text-gray-400">Action</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">IP Address</TableHead>
                  <TableHead className="text-gray-400">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell className="font-medium">{log.feature_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gray-700">
                        {log.action === "validation" ? "Password Check" : 
                         log.action === "lock" ? "Lock Feature" :
                         log.action === "unlock" ? "Unlock Feature" : 
                         log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(log.success)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{userMap?.nameMap.get(log.user_id) || "Unknown"}</span>
                        <span className="text-xs text-gray-500">{userMap?.emailMap.get(log.user_id) || ""}</span>
                      </div>
                    </TableCell>
                    <TableCell>{log.ip_address || "Unknown"}</TableCell>
                    <TableCell>
                      <div className="whitespace-nowrap text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
