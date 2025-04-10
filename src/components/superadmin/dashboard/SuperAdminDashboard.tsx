
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, DollarSign, AlertTriangle, MessageSquare, 
  BarChart2, Activity, Globe, Settings 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

const SuperAdminDashboard: React.FC = () => {
  // Fetch user statistics
  const { data: userStats, isLoading: loadingUsers } = useQuery({
    queryKey: ['superadmin', 'userStats'],
    queryFn: async () => {
      // In a real implementation, we'd fetch this from the database
      return {
        total: 1250,
        business: 320,
        individual: 490,
        free: 440,
        growthRate: 12.5
      };
    },
  });

  // Fetch recent audit logs
  const { data: auditLogs, isLoading: loadingAudit } = useQuery({
    queryKey: ['superadmin', 'auditLogs'],
    queryFn: async () => {
      // In a real implementation, we'd fetch actual logs
      return [
        { id: 1, user: 'admin@wakti.app', action: 'login', timestamp: '2025-04-10T15:32:45Z', status: 'success' },
        { id: 2, user: 'admin@wakti.app', action: 'view_users', timestamp: '2025-04-10T15:33:12Z', status: 'success' },
        { id: 3, user: 'user@example.com', action: 'login_attempt', timestamp: '2025-04-10T15:35:01Z', status: 'failed' },
        { id: 4, user: 'business@example.com', action: 'upgrade_plan', timestamp: '2025-04-10T15:40:22Z', status: 'success' },
      ];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Super Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">System Status:</span>
          <span className="flex items-center text-green-500">
            <Activity className="h-4 w-4 mr-1" /> Operational
          </span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{userStats?.total || "Loading..."}</div>
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-500">↑ {userStats?.growthRate || 0}%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Business Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{userStats?.business || "Loading..."}</div>
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-500">↑ 8.2%</span> conversion rate
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">3</div>
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-yellow-500">2 high, 1 medium</span> severity
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Support Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">12</div>
              <MessageSquare className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-red-500">5 unassigned</span> tickets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button variant="outline" className="flex flex-col items-center justify-center h-20 bg-gray-800 hover:bg-gray-700 border-gray-700">
              <Users className="h-5 w-5 mb-1" />
              <span className="text-xs">User Management</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center justify-center h-20 bg-gray-800 hover:bg-gray-700 border-gray-700">
              <DollarSign className="h-5 w-5 mb-1" />
              <span className="text-xs">Billing Controls</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center justify-center h-20 bg-gray-800 hover:bg-gray-700 border-gray-700">
              <Settings className="h-5 w-5 mb-1" />
              <span className="text-xs">System Settings</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center justify-center h-20 bg-gray-800 hover:bg-gray-700 border-gray-700">
              <AlertTriangle className="h-5 w-5 mb-1" />
              <span className="text-xs">Security Center</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two column layout for audit log and system metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audit Log */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {loadingAudit ? (
                <p className="text-gray-500 text-center">Loading audit logs...</p>
              ) : (
                <div className="space-y-4">
                  {auditLogs?.map((log) => (
                    <div key={log.id} className="pb-4 border-b border-gray-800">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-gray-300">{log.action}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          log.status === 'success' ? 'bg-green-900/20 text-green-400' : 
                          'bg-red-900/20 text-red-400'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">User: {log.user}</div>
                      <div className="text-xs text-gray-600">{new Date(log.timestamp).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* System Metrics */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">System Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Database Status</span>
                  <span className="text-sm text-green-500">Healthy</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">CPU: 12%</span>
                  <span className="text-xs text-gray-500">Memory: 32%</span>
                </div>
              </div>

              <Separator className="bg-gray-800" />

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">API Health</span>
                  <span className="text-sm text-green-500">97.8% uptime</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '97.8%' }}></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">Avg response: 128ms</span>
                  <span className="text-xs text-gray-500">Errors: 0.02%</span>
                </div>
              </div>

              <Separator className="bg-gray-800" />

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Current Active Users</span>
                  <span className="text-sm text-blue-500">87</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <Globe className="h-4 w-4 text-gray-500 mr-1" />
                  <div className="text-xs text-gray-500 flex-1">
                    <span className="text-blue-400">35 Qatar</span>, 
                    <span className="text-green-400"> 22 UAE</span>, 
                    <span className="text-purple-400"> 30 Others</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
