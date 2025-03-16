
import React, { useState } from "react";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DownloadIcon, Loader2, Mail, Search, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

const SubscribersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { subscribers, subscriberCount, isLoading } = useBusinessSubscribers();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleExportSubscribers = () => {
    if (!subscribers || subscribers.length === 0) {
      toast({
        title: "No subscribers to export",
        description: "You don't have any subscribers yet."
      });
      return;
    }
    
    // Create CSV content
    const headers = ["Name", "Email", "Subscribed On", "Status"];
    const csvContent = [
      headers.join(","),
      ...subscribers.map(sub => {
        const name = sub.profile?.display_name || sub.profile?.full_name || 'Unknown';
        // Email would come from a join to auth.users table in a real implementation
        const email = "subscriber@example.com"; 
        const date = format(new Date(sub.subscription_date), 'yyyy-MM-dd');
        const status = sub.status;
        
        return [name, email, date, status].join(",");
      })
    ].join("\n");
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Filter subscribers based on search query
  const filteredSubscribers = subscribers?.filter(sub => {
    const searchLower = searchQuery.toLowerCase();
    const name = (sub.profile?.display_name || sub.profile?.full_name || '').toLowerCase();
    
    return name.includes(searchLower);
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subscribers</h2>
          <p className="text-muted-foreground">
            Manage your business subscribers and track engagement.
          </p>
        </div>
        <Button onClick={handleExportSubscribers} disabled={!subscribers || subscribers.length === 0}>
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export Subscribers
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriberCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscribers?.filter(s => s.status === 'active').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscribers?.filter(s => {
                const subDate = new Date(s.subscription_date);
                const now = new Date();
                return subDate.getMonth() === now.getMonth() && 
                       subDate.getFullYear() === now.getFullYear();
              }).length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscribers && subscribers.length > 0 
                ? Math.round((subscribers.filter(s => s.interaction_count > 0).length / subscribers.length) * 100)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Subscriber List</CardTitle>
          <CardDescription>
            View and manage all your business subscribers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search subscribers..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          
          {!subscribers || subscribers.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">No subscribers yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                When users subscribe to your business, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subscriber</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers?.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage 
                              src={subscriber.profile?.avatar_url || undefined} 
                              alt={subscriber.profile?.display_name || "Subscriber"} 
                            />
                            <AvatarFallback>
                              {(subscriber.profile?.display_name?.[0] || subscriber.profile?.full_name?.[0] || 'S').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {subscriber.profile?.display_name || subscriber.profile?.full_name || 'Unknown'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Interactions: {subscriber.interaction_count}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(subscriber.subscription_date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={subscriber.status === 'active' ? 'default' : 'secondary'}
                        >
                          {subscriber.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscribersList;
