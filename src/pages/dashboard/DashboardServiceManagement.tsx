
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Plus, Search, Users, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  duration: number;
  created_at: string;
  updated_at: string;
}

const DashboardServiceManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddService, setOpenAddService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Fetch services
  const { data: services, isLoading, error, refetch } = useQuery({
    queryKey: ['businessServices'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('business_services')
        .select('*')
        .eq('business_id', session.session.user.id)
        .order('name');
        
      if (error) throw error;
      return data as Service[];
    }
  });

  // Filter services based on search query
  const filteredServices = services?.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation would go here
    setOpenAddService(false);
    toast({
      title: "Service added",
      description: "The service has been added successfully.",
    });
    refetch();
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setOpenAddService(true);
  };

  const handleDeleteService = (id: string) => {
    // Implementation would go here
    toast({
      title: "Service deleted",
      description: "The service has been deleted successfully.",
    });
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Service Management</h1>
          <p className="text-muted-foreground">Create and manage your business services.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={openAddService} onOpenChange={setOpenAddService}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAddService}>
                <DialogHeader>
                  <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                  <DialogDescription>
                    {editingService 
                      ? "Edit the details of your existing service." 
                      : "Create a new service for your business."}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Service Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Service name"
                      className="col-span-3"
                      defaultValue={editingService?.name || ""}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <textarea
                      id="description"
                      placeholder="Service description"
                      className="col-span-3 min-h-[80px] flex w-full rounded-md border border-input bg-background px-3 py-2"
                      defaultValue={editingService?.description || ""}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="col-span-3"
                      defaultValue={editingService?.price || ""}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">
                      Duration (min)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="60"
                      className="col-span-3"
                      defaultValue={editingService?.duration || ""}
                      required
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpenAddService(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingService ? "Update Service" : "Add Service"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search services..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">
          <p>Error loading services</p>
        </div>
      ) : filteredServices?.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <DollarSign className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Services</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No services match your search." : "You haven't added any services yet."}
            </p>
            <Button onClick={() => setOpenAddService(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices?.map((service) => (
            <Card key={service.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>{service.name}</CardTitle>
                  {service.price && (
                    <Badge variant="secondary" className="ml-2">
                      ${service.price.toFixed(2)}
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {service.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{service.duration} minutes</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>0 staff assigned</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleEditService(service)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardServiceManagement;
