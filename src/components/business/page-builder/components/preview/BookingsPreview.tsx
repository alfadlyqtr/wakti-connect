
import React from "react";
import { useBusinessPage } from "../../context/BusinessPageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const BookingsPreview = () => {
  const { pageData } = useBusinessPage();
  const { viewStyle, templates } = pageData.bookings;
  
  if (!templates.length) {
    return (
      <div className="py-4 px-6 bg-muted/20 rounded border border-dashed">
        <p className="text-center text-sm text-muted-foreground">
          No booking templates have been selected
        </p>
      </div>
    );
  }

  if (viewStyle === "dropdown") {
    return (
      <div className="py-4">
        <h3 className="text-xl font-semibold mb-4 text-center">Book an Appointment</h3>
        <div className="max-w-md mx-auto">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {templates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="w-full mt-4">Book Now</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h3 className="text-xl font-semibold mb-4 text-center">Book an Appointment</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map(template => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="text-sm">{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button size="sm" className="w-full">Book Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
