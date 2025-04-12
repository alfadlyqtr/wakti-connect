
import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Search, Filter, MoreHorizontal, UserPlus, Trash, Shield, 
  Download, PenTool, Eye, Users, Clock, X, CheckCircle2, 
  AlertTriangle, Lock, Unlock, UserX, UserCheck
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
import { createAuditLog } from "@/types/auditLogs";
import { toast } from "@/components/ui/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface User {
  id: string;
  email: string;
  full_name: string;
  account_type: UserRole;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
}

const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [showVerified, setShowVerified] = useState(false);
  const [impersonateDialogOpen, setImpersonateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>('free');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState<'created_at' | 'last_login_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch users data
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .rpc('admin_get_all_users');
        
        if (error) {
          toast({
            title: "Error loading users",
            description: error.message,
            variant: "destructive"
          });
          throw error;
        }
        
        return data as User[];
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase.rpc('admin_reset_user_password', {
        user_email: email
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Password reset email sent",
        description: "A password reset email has been sent to the user.",
        variant: "success"
      });
      setResetPasswordDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error sending password reset",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: string }) => {
      const { data, error } = await supabase.rpc('admin_update_user_role', {
        user_id: userId,
        new_role: role
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "User role updated",
        description: "The user's role has been successfully updated.",
        variant: "success"
      });
      setChangeRoleDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Toggle user active status mutation
  const toggleActiveStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string, isActive: boolean }) => {
      const { data, error } = await supabase.rpc('admin_toggle_user_active', {
        user_id: userId,
        is_active: isActive
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      toast({
        title: `User ${variables.isActive ? 'activated' : 'deactivated'}`,
        description: `The user has been ${variables.isActive ? 'activated' : 'deactivated'} successfully.`,
        variant: "success"
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating user status",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.rpc('admin_delete_user', {
        user_id: userId
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
        variant: "success"
      });
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Handle impersonation (placeholder for now)
  const handleImpersonateUser = useCallback((user: User) => {
    setSelectedUser(user);
    setImpersonateDialogOpen(true);
  }, []);

  const confirmImpersonation = useCallback(async () => {
    if (!selectedUser) return;
    
    try {
      await createAuditLog(
        supabase,
        'current-admin-id',
        'impersonate_user',
        { 
          target_user_id: selectedUser.id, 
          user_email: selectedUser.email 
        }
      );
      
      toast({
        title: "User impersonation",
        description: `You are now impersonating ${selectedUser.full_name || selectedUser.email}`,
        variant: "success"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to impersonate user",
        variant: "destructive"
      });
    } finally {
      setImpersonateDialogOpen(false);
    }
  }, [selectedUser]);

  // Handle role change
  const handleChangeRole = useCallback((user: User) => {
    setSelectedUser(user);
    setNewRole(user.account_type);
    setChangeRoleDialogOpen(true);
  }, []);

  const confirmRoleChange = useCallback(() => {
    if (!selectedUser || !newRole) return;
    
    updateRoleMutation.mutate({
      userId: selectedUser.id,
      role: newRole
    });
  }, [selectedUser, newRole, updateRoleMutation]);

  // Handle status toggle
  const handleToggleStatus = useCallback((user: User) => {
    toggleActiveStatusMutation.mutate({
      userId: user.id,
      isActive: !user.is_active
    });
  }, [toggleActiveStatusMutation]);

  // Handle password reset
  const handleResetPassword = useCallback((user: User) => {
    setSelectedUser(user);
    setResetPasswordDialogOpen(true);
  }, []);

  const confirmResetPassword = useCallback(() => {
    if (!selectedUser) return;
    
    resetPasswordMutation.mutate(selectedUser.email);
  }, [selectedUser, resetPasswordMutation]);

  // Handle user deletion
  const handleDeleteUser = useCallback((user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDeleteUser = useCallback(() => {
    if (!selectedUser) return;
    
    deleteUserMutation.mutate(selectedUser.id);
  }, [selectedUser, deleteUserMutation]);

  // Export users as CSV
  const handleExportUsers = useCallback(() => {
    if (users.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no users to export.",
        variant: "destructive"
      });
      return;
    }

    const headers = ['ID', 'Email', 'Name', 'Role', 'Status', 'Created At', 'Last Login'];
    
    const csvData = users.map(user => [
      user.id,
      user.email,
      user.full_name || '',
      user.account_type,
      user.is_active ? 'Active' : 'Deactivated',
      user.created_at ? new Date(user.created_at).toLocaleString() : '',
      user.last_login_at ? new Date(user.last_login_at).toLocaleString() : ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: "Users data has been exported to CSV.",
      variant: "success"
    });
  }, [users]);

  const getFilteredUsers = useCallback(() => {
    let filteredUsers = [...users];
    
    // Apply tab filter
    if (selectedTab !== 'all') {
      filteredUsers = filteredUsers.filter(user => {
        if (selectedTab === 'business') return user.account_type === 'business';
        if (selectedTab === 'individual') return user.account_type === 'individual';
        if (selectedTab === 'free') return user.account_type === 'free';
        if (selectedTab === 'staff') return user.account_type === 'staff';
        if (selectedTab === 'inactive') return !user.is_active;
        return true;
      });
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        (user.email && user.email.toLowerCase().includes(query)) || 
        (user.full_name && user.full_name.toLowerCase().includes(query)) ||
        user.id.toLowerCase().includes(query)
      );
    }
    
    // Apply verified filter (using last_login_at as a proxy for "verified")
    if (showVerified) {
      filteredUsers = filteredUsers.filter(user => user.last_login_at);
    }
    
    // Apply sorting
    filteredUsers.sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      
      if (!aValue && bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue && !bValue) return sortOrder === 'asc' ? 1 : -1;
      if (!aValue && !bValue) return 0;
      
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
    
    return filteredUsers;
  }, [users, selectedTab, searchQuery, showVerified, sortBy, sortOrder]);

  const handleSortChange = useCallback((column: 'created_at' | 'last_login_at') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  }, [sortBy, sortOrder]);

  const filteredUsers = getFilteredUsers();

  const getStatusBadge = (status: boolean) => {
    return status ? 
      <Badge className="bg-green-600">Active</Badge> : 
      <Badge className="bg-red-600">Inactive</Badge>;
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'PPp');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Count different user types for statistics
  const userCounts = {
    total: users.length,
    business: users.filter(u => u.account_type === 'business').length,
    individual: users.filter(u => u.account_type === 'individual').length,
    inactive: users.filter(u => !u.is_active).length,
    free: users.filter(u => u.account_type === 'free').length,
    staff: users.filter(u => u.account_type === 'staff').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <Button
          variant="destructive"
          className="bg-red-600 hover:bg-red-700"
          disabled={true} // Disabled until we implement user creation
        >
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
            <div className="text-2xl font-bold text-white">{userCounts.total}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Business Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userCounts.business}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Individual Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userCounts.individual}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Inactive Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userCounts.inactive}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-96">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users by email, name or ID..." 
              className="pl-8 bg-gray-900 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-2">
            <Switch
              id="verified"
              checked={showVerified}
              onCheckedChange={setShowVerified}
            />
            <Label htmlFor="verified" className="text-gray-400">Show logged in only</Label>
          </div>
          
          <Button 
            variant="outline" 
            className="border-gray-700 text-gray-400"
            onClick={() => refetch()}
          >
            <Clock className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-700 text-gray-400"
            onClick={handleExportUsers}
          >
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
          <TabsTrigger value="inactive" className="data-[state=active]:bg-gray-700">Inactive</TabsTrigger>
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
                    <TableHead 
                      className="text-gray-400 cursor-pointer"
                      onClick={() => handleSortChange('created_at')}
                    >
                      Created {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="text-gray-400 cursor-pointer"
                      onClick={() => handleSortChange('last_login_at')}
                    >
                      Last Login {sortBy === 'last_login_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
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
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-800 border-gray-800">
                        <TableCell>
                          <div className="font-medium text-white">{user.full_name || 'No Name'}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-600">{user.id}</div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.account_type)}</TableCell>
                        <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                        <TableCell className="text-gray-400">
                          {formatDate(user.created_at)}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {formatDate(user.last_login_at)}
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
                              
                              <DropdownMenuItem 
                                className="text-gray-300 focus:bg-gray-800 focus:text-gray-100 cursor-pointer"
                                onClick={() => handleChangeRole(user)}
                              >
                                <PenTool className="mr-2 h-4 w-4" />
                                <span>Change Role</span>
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator className="bg-gray-800" />
                              
                              <DropdownMenuItem 
                                className="text-gray-300 focus:bg-gray-800 focus:text-gray-100 cursor-pointer"
                                onClick={() => handleToggleStatus(user)}
                              >
                                {user.is_active ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    <span>Deactivate</span>
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    <span>Activate</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem 
                                className="text-gray-300 focus:bg-gray-800 focus:text-gray-100 cursor-pointer"
                                onClick={() => handleResetPassword(user)}
                              >
                                <Lock className="mr-2 h-4 w-4" />
                                <span>Reset Password</span>
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator className="bg-gray-800" />
                              
                              <DropdownMenuItem 
                                className="text-red-400 focus:bg-gray-800 focus:text-red-300 cursor-pointer"
                                onClick={() => handleDeleteUser(user)}
                              >
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

      {/* Impersonate User Dialog */}
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
                  <span className="font-medium text-white">{selectedUser.full_name || 'No Name Set'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Email:</span>
                  <span className="font-medium text-white">{selectedUser.email}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Account Type:</span>
                  <span>{getRoleBadge(selectedUser.account_type)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span>{getStatusBadge(selectedUser.is_active)}</span>
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

      {/* Change Role Dialog */}
      <Dialog open={changeRoleDialogOpen} onOpenChange={setChangeRoleDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center">
              <PenTool className="h-5 w-5 text-blue-500 mr-2" />
              Change User Role
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Change the account type for this user. This action will be audited.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Name:</span>
                  <span className="font-medium text-white">{selectedUser.full_name || 'No Name Set'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Email:</span>
                  <span className="font-medium text-white">{selectedUser.email}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Current Role:</span>
                  <span>{getRoleBadge(selectedUser.account_type)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-role" className="text-gray-400">Select New Role</Label>
                <select
                  id="new-role"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                >
                  <option value="free">Free</option>
                  <option value="individual">Individual</option>
                  <option value="business">Business</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              
              <div className="bg-blue-950 p-3 rounded-md border border-blue-900">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-300">
                    Changing a user's role may affect their access to certain features and data. Make sure this is intentional.
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setChangeRoleDialogOpen(false)}
              className="text-gray-400"
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={confirmRoleChange}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!selectedUser || selectedUser.account_type === newRole}
            >
              Change Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <AlertDialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center">
              <Lock className="h-5 w-5 text-yellow-500 mr-2" />
              Reset User Password
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {selectedUser && (
                <>
                  This will send a password reset email to <span className="font-medium text-white">{selectedUser.email}</span>.
                  The user will need to click the link in the email to set a new password.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-yellow-600 text-white hover:bg-yellow-700"
              onClick={confirmResetPassword}
            >
              Send Reset Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center">
              <Trash className="h-5 w-5 text-red-500 mr-2" />
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {selectedUser && (
                <>
                  Are you sure you want to delete <span className="font-medium text-white">{selectedUser.full_name || selectedUser.email}</span>?
                  This action cannot be undone and will permanently delete the user and all associated data.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={confirmDeleteUser}
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersPage;
