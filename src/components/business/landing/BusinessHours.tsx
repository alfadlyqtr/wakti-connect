
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BusinessHoursProps {
  section: BusinessPageSection;
}

const BusinessHours = ({ section }: BusinessHoursProps) => {
  const { t } = useTranslation();
  const content = section.section_content || {};
  
  const {
    title = t("business.businessHours"),
    hours = {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "10:00", close: "15:00", closed: false },
      sunday: { open: "10:00", close: "15:00", closed: true }
    }
  } = content;
  
  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" }
  ];
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-3">
            {days.map((day) => {
              const dayData = hours[day.key as keyof typeof hours];
              const isClosed = dayData?.closed;
              
              return (
                <div key={day.key} className="flex justify-between items-center py-1">
                  <div className="font-medium">{day.label}</div>
                  <div>
                    {isClosed ? (
                      <span className="text-muted-foreground">{t("business.closed")}</span>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {dayData?.open} - {dayData?.close}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessHours;
