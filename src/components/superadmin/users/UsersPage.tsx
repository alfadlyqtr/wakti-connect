import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, Filter, MoreHorizontal, UserPlus, Trash, Shield, 
  Download, PenTool, Eye, Users, Clock, X
} from "lucide-react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, 
  DialogTitle, DialogFooter, DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  name: string;
  accountType: UserRole;
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
  lastLogin: string;
}

const UsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [showVerified, setShowVerified] = useState(false);
  const [impersonateDialogOpen, setImpersonateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['superadmin', 'users', searchQuery, selectedTab, showVerified],
    queryFn: async () => {
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'business@example.com',
          name: 'Example Business',
          accountType: 'business',
          status: 'active',
          createdAt: '2023-01-15T10:30:00Z',
          lastLogin: '2025-04-09T08:45:00Z'
        },
        {
          id: '2',
          email: 'individual@example.com',
          name: 'John Individual',
          accountType: 'individual',
          status: 'active',
          createdAt: '2023-02-10T15:20:00Z',
          lastLogin: '2025-04-10T12:30:00Z'
        },
        {
          id: '3',
          email: 'free@example.com',
          name: 'Free User',
          accountType: 'free',
          status: 'active',
          createdAt: '2023-03-05T09:15:00Z',
          lastLogin: '2025-04-07T16:20:00Z'
        },
        {
          id: '4',
          email: 'staff@example.com',
          name: 'Staff Member',
          accountType: 'staff',
          status: 'active',
          createdAt: '2023-02-20T11:45:00Z',
          lastLogin: '2025-04-08T14:10:00Z'
        },
        {
          id: '5',
          email: 'suspended@example.com',
          name: 'Suspended User',
          accountType: 'free',
          status: 'suspended',
          createdAt: '2023-01-25T08:30:00Z',
          lastLogin: '2025-03-15T10:05:00Z'
        }
      ];
      
      let filteredUsers = [...mockUsers];
      if (selectedTab !== 'all') {
        filteredUsers = filteredUsers.filter(user => 
          selectedTab === 'business' 
            ? user.accountType === 'business'
            : selectedTab === 'individual'
              ? user.accountType === 'individual'
              : selectedTab === 'staff'
                ? user.accountType === 'staff'
                : selectedTab === 'free'
                  ? user.accountType === 'free'
                  : selectedTab === 'suspended'
                    ? user.status === 'suspended'
                    : true
        );
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.email.toLowerCase().includes(query) || 
          user.name.toLowerCase().includes(query)
        );
      }
      
      return filteredUsers;
    },
  });

  const handleImpersonateUser = (user: User) => {
    setSelectedUser(user);
    setImpersonateDialogOpen(true);
  };

  const confirmImpersonation = async () => {
    if (!selectedUser) return;
    
    console.log(`Impersonating user: ${selectedUser.email}`);
    
    try {
      const { data: tableExists } = await supabase
        .from('_metadata')
        .select('*')
        .eq('table_name', 'audit_logs')
        .maybeSingle();
        
      if (tableExists) {
        try {
          await supabase.rpc('log_admin_action', {
            action_type: 'impersonate_user',
            user_id: 'current-admin-id',
            metadata: { target_user_id: selectedUser.id, user_email: selectedUser.email }
          });
        } catch (error) {
          console.warn("Failed to log impersonation action:", error);
        }
      } else {
        console.warn("Audit logs table does not exist yet - skipping audit logging");
      }
    } catch (error) {
      console.warn("Error checking for audit_logs table:", error);
    }
    
    setImpersonateDialogOpen(false);
    
    alert(`Impersonation mode activated for ${selectedUser.email}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-amber-600">Suspended</Badge>;
      case 'banned':
        return <Badge className="bg-red-600">Banned</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'business':
        return <Badge className="bg-blue-600">Business</Badge>;
      case 'individual':
        return <Badge className="bg-purple-600">Individual</Badge>;
      case 'staff':
        return <Badge className="bg-cyan-600">Staff</Badge>;
      case 'free':
        return <Badge className="bg-gray-600">Free</Badge>;
      case 'super-admin':
        return <Badge className="bg-red-600">Super Admin</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <Button variant="default" className="bg-red-600 hover:bg-red-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{users?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Business Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {users?.filter(u => u.accountType === 'business').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Individual Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {users?.filter(u => u.accountType === 'individual').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Suspended Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {users?.filter(u => u.status === 'suspended').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-96">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users by email or name..." 
              className="pl-8 bg-gray-900 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="verified"
              checked={showVerified}
              onCheckedChange={setShowVerified}
            />
            <Label htmlFor="verified" className="text-gray-400">Show verified only</Label>
          </div>
          
          <Button variant="outline" className="border-gray-700 text-gray-400">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <Button variant="outline" className="border-gray-700 text-gray-400">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="bg-gray-800">
          <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">All Users</TabsTrigger>
          <TabsTrigger value="business" className="data-[state=active]:bg-gray-700">Business</TabsTrigger>
          <TabsTrigger value="individual" className="data-[state=active]:bg-gray-700">Individual</TabsTrigger>
          <TabsTrigger value="free" className="data-[state=active]:bg-gray-700">Free</TabsTrigger>
          <TabsTrigger value="staff" className="data-[state=active]:bg-gray-700">Staff</TabsTrigger>
          <TabsTrigger value="suspended" className="data-[state=active]:bg-gray-700">Suspended</TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedTab} className="mt-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-950">
                  <TableRow className="hover:bg-gray-900">
                    <TableHead className="text-gray-400">Name/Email</TableHead>
                    <TableHead className="text-gray-400">Account Type</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Registered</TableHead>
                    <TableHead className="text-gray-400">Last Login</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 p-8">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : users && users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-800 border-gray-800">
                        <TableCell>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.accountType)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-gray-500">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800">
                              <DropdownMenuItem 
                                className="text-gray-300 focus:bg-gray-800 focus:text-gray-100 cursor-pointer"
                                onClick={() => handleImpersonateUser(user)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Impersonate</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100 cursor-pointer">
                                <PenTool className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-800" />
                              <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100 cursor-pointer">
                                <Shield className="mr-2 h-4 w-4" />
                                <span>{user.status === 'active' ? 'Suspend' : 'Activate'}</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-800" />
                              <DropdownMenuItem className="text-red-400 focus:bg-gray-800 focus:text-red-300 cursor-pointer">
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 p-8">
                        No users found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={impersonateDialogOpen} onOpenChange={setImpersonateDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center">
              <Shield className="h-5 w-5 text-red-500 mr-2" />
              Impersonate User
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              You are about to log in as another user. This action will be audited.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Name:</span>
                  <span className="font-medium text-white">{selectedUser.name}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Email:</span>
                  <span className="font-medium text-white">{selectedUser.email}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Account Type:</span>
                  <span>{getRoleBadge(selectedUser.accountType)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span>{getStatusBadge(selectedUser.status)}</span>
                </div>
              </div>
              
              <div className="mt-6 bg-red-950 p-3 rounded-md border border-red-900">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-300">
                    This session will automatically expire after 2 hours or when you manually end impersonation.
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setImpersonateDialogOpen(false)}
              className="text-gray-400"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmImpersonation}
              className="bg-red-600 hover:bg-red-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Start Impersonation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
