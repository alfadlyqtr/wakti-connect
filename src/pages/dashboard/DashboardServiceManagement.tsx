
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Plus, Search, Users, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define service form schema
const serviceFormSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  price: z.string().optional().transform(val => val ? parseFloat(val) : null),
  duration: z.string().min(1, "Duration is required").transform(val => parseInt(val)),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

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
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddService, setOpenAddService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Setup form
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      duration: "60",
    }
  });

  // Reset form when dialog opens/closes or when editing service changes
  React.useEffect(() => {
    if (openAddService) {
      if (editingService) {
        form.reset({
          name: editingService.name,
          description: editingService.description || "",
          price: editingService.price?.toString() || "",
          duration: editingService.duration.toString(),
        });
      } else {
        form.reset({
          name: "",
          description: "",
          price: "",
          duration: "60",
        });
      }
    }
  }, [openAddService, editingService, form]);

  // Fetch services
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['businessServices'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('business_services')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as Service[];
    }
  });

  // Add service mutation
  const addServiceMutation = useMutation({
    mutationFn: async (formData: ServiceFormValues) => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('business_services')
        .insert({
          name: formData.name,
          description: formData.description || null,
          price: formData.price || null,
          duration: formData.duration,
          business_id: session.session.user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessServices'] });
      toast({
        title: "Service added",
        description: "The service has been added successfully.",
      });
      setOpenAddService(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add service",
        variant: "destructive"
      });
    }
  });

  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string, formData: ServiceFormValues }) => {
      const { data, error } = await supabase
        .from('business_services')
        .update({
          name: formData.name,
          description: formData.description || null,
          price: formData.price || null,
          duration: formData.duration,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessServices'] });
      toast({
        title: "Service updated",
        description: "The service has been updated successfully.",
      });
      setOpenAddService(false);
      setEditingService(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update service",
        variant: "destructive"
      });
    }
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessServices'] });
      toast({
        title: "Service deleted",
        description: "The service has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service",
        variant: "destructive"
      });
    }
  });

  // Filter services based on search query
  const filteredServices = services?.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = (values: ServiceFormValues) => {
    if (editingService) {
      updateServiceMutation.mutate({ id: editingService.id, formData: values });
    } else {
      addServiceMutation.mutate(values);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setOpenAddService(true);
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteServiceMutation.mutate(id);
    }
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <DialogHeader>
                    <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                    <DialogDescription>
                      {editingService 
                        ? "Edit the details of your existing service." 
                        : "Create a new service for your business."}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Service name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <textarea
                              className="min-h-[80px] flex w-full rounded-md border border-input bg-background px-3 py-2"
                              placeholder="Service description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (min)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="60" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => {
                      setOpenAddService(false);
                      setEditingService(null);
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={addServiceMutation.isPending || updateServiceMutation.isPending}>
                      {(addServiceMutation.isPending || updateServiceMutation.isPending) ? "Saving..." : 
                        (editingService ? "Update Service" : "Add Service")}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
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
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteService(service.id)}
                  disabled={deleteServiceMutation.isPending}
                >
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
