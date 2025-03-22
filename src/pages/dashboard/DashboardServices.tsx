
import React, { useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const DashboardServices = () => {
  const [isViewMode, setIsViewMode] = useState(true);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
      </div>
      
      {isViewMode && (
        <>
          <div className="mb-6">
            <Card>
              <CardContent className="p-4">
                <p className="text-muted-foreground text-center py-8">
                  No services found. Create your first service to get started.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Button onClick={() => {
            setIsViewMode(false);
            setIsCreateMode(true);
          }}>Create Service</Button>
        </>
      )}
      
      {isCreateMode && (
        <div className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Service</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                setIsCreateMode(false);
                setIsViewMode(true);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Service Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded"
                      placeholder="Enter service name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (QAR)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                      placeholder="30"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsCreateMode(false);
                        setIsViewMode(true);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Service</Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      
      {isEditMode && (
        <div className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Service</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                setIsEditMode(false);
                setIsViewMode(true);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Service Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (QAR)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditMode(false);
                        setIsViewMode(true);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Update Service</Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
};

export default DashboardServices;
