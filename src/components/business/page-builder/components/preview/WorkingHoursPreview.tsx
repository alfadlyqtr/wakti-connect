
import React from "react";
import { useBusinessPage } from "../../context/BusinessPageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const WorkingHoursPreview = () => {
  const { pageData } = useBusinessPage();
  const { layout, hours } = pageData.workingHours;
  
  if (!hours || hours.length === 0) {
    return (
      <div className="py-4 px-6 bg-muted/20 rounded border border-dashed">
        <p className="text-center text-sm text-muted-foreground">
          Working hours will appear here once set
        </p>
      </div>
    );
  }

  if (layout === "card") {
    return (
      <div className="py-4">
        <h3 className="text-xl font-semibold mb-4 text-center">Working Hours</h3>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Our Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hours.map((hour) => (
                <div key={hour.day} className="flex justify-between">
                  <span className="font-medium">{hour.day}</span>
                  <span>
                    {hour.closed ? 'Closed' : `${hour.open} - ${hour.close}`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h3 className="text-xl font-semibold mb-4 text-center">Working Hours</h3>
      <div className="space-y-1">
        {hours.map((hour) => (
          <div key={hour.day} className="flex justify-between py-1 border-b">
            <span className="font-medium">{hour.day}</span>
            <span>{hour.closed ? 'Closed' : `${hour.open} - ${hour.close}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
