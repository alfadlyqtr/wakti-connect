
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, ShieldAlert, BadgeX, CheckCircle, MoreHorizontal, Search, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UserStatus = "active" | "suspended" | "banned" | "pending";

interface UserTableRow {
  id: string;
  email: string;
  accountType: string;
  status: UserStatus;
  created_at: string;
  lastLogin?: string;
  actions?: string[];
  isConfirmed?: boolean;
}

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch users from Auth and combine with Profile data
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["superadmin", "users"],
    queryFn: async () => {
      try {
        // Get users from Auth
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error("Error fetching auth users:", authError);
          throw authError;
        }
        
        if (!authUsers?.users) {
          console.warn("No auth users found");
          return [];
        }
        
        // Get profiles to get additional user data
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*");
          
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          throw profilesError;
        }
        
        // Combine data
        const combinedUsers: UserTableRow[] = authUsers.users.map(authUser => {
          const profile = profiles?.find(p => p.id === authUser.id);
          
          return {
            id: authUser.id,
            email: authUser.email || "No email",
            accountType: profile?.account_type || "free",
            status: authUser.banned ? "banned" : (authUser.email_confirmed_at ? "active" : "pending"),
            created_at: new Date(authUser.created_at).toLocaleDateString(),
            lastLogin: authUser.last_sign_in_at 
              ? new Date(authUser.last_sign_in_at).toLocaleDateString() 
              : "Never",
            isConfirmed: !!authUser.email_confirmed_at
          };
        });
        
        return combinedUsers;
      } catch (error) {
        console.error("Error in user query function:", error);
        toast({
          title: "Error fetching users",
          description: "Please check your permissions or try again later.",
          variant: "destructive",
        });
        throw error;
      }
    },
  });
  
  // Filter the users based on the search term
  const filteredUsers = users?.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.accountType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserAction = async (userId: string, action: string) => {
    try {
      switch (action) {
        case "suspend":
          // Implement suspend logic
          toast({
            title: "User Suspended",
            description: "The user has been suspended successfully.",
          });
          break;
        case "ban":
          // Implement ban logic
          toast({
            title: "User Banned",
            description: "The user has been banned successfully.",
          });
          break;
        case "verify":
          // Implement verify logic
          toast({
            title: "User Verified",
            description: "The user has been verified successfully.",
          });
          break;
        case "delete":
          // Implement delete logic
          toast({
            title: "User Deleted",
            description: "The user has been deleted successfully.",
          });
          break;
        default:
          break;
      }
      // Refresh the users list after action
      refetch();
    } catch (error) {
      console.error(`Error performing ${action} on user:`, error);
      toast({
        title: "Action Failed",
        description: `Failed to ${action} the user. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-600">Active</span>;
      case "suspended":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-600">Suspended</span>;
      case "banned":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-600">Banned</span>;
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-600">Pending</span>;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Users Management</h1>
        </div>
        
        <Card className="p-6 bg-gray-900 border-gray-800">
          <div className="text-center py-8">
            <ShieldAlert className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Users</h2>
            <p className="text-gray-400 mb-4">
              There was a problem loading the users. This could be due to insufficient privileges or network issues.
            </p>
            <Button onClick={() => refetch()} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Button onClick={() => refetch()} className="flex items-center gap-2">
          {isLoading ? <LoadingSpinner size="sm" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <Card className="bg-gray-900 border-gray-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold">All Users</h2>
            <div className="ml-3 px-2.5 py-0.5 rounded-full bg-blue-900/30 text-blue-400 text-xs font-medium">
              {users?.length || 0} users
            </div>
          </div>
          
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              className="pl-8 bg-gray-800 border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Separator className="bg-gray-800 mb-4" />

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredUsers?.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-400">Email</TableHead>
                  <TableHead className="text-gray-400">Account Type</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Created</TableHead>
                  <TableHead className="text-gray-400">Last Login</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-gray-800">
                    <TableCell className="text-gray-300 font-medium">{user.email}</TableCell>
                    <TableCell className="capitalize">{user.accountType}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-sm text-gray-500">{user.created_at}</TableCell>
                    <TableCell className="text-sm text-gray-500">{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                          <DropdownMenuItem
                            className="text-gray-300 cursor-pointer"
                            onClick={() => handleUserAction(user.id, "view")}
                          >
                            View Details
                          </DropdownMenuItem>
                          {!user.isConfirmed && (
                            <DropdownMenuItem
                              className="text-green-500 cursor-pointer"
                              onClick={() => handleUserAction(user.id, "verify")}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Verify Email
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-yellow-500 cursor-pointer"
                            onClick={() => handleUserAction(user.id, "suspend")}
                          >
                            <ShieldAlert className="h-4 w-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 cursor-pointer"
                            onClick={() => handleUserAction(user.id, "ban")}
                          >
                            <BadgeX className="h-4 w-4 mr-2" />
                            Ban User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Users Found</h3>
            <p className="text-gray-500">
              {searchTerm ? `No users matching "${searchTerm}"` : "No users are registered yet."}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UsersPage;
