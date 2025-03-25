
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash, AlertCircle } from "lucide-react";
import { BookingTemplateWithRelations, BookingTemplateAvailability, BookingTemplateException } from "@/types/booking.types";
import { format } from "date-fns";

interface TemplateAvailabilityManagerProps {
  isOpen: boolean;
  onClose: () => void;
  template: BookingTemplateWithRelations;
  availability: BookingTemplateAvailability[];
  exceptions: BookingTemplateException[];
  isLoadingAvailability: boolean;
  isLoadingExceptions: boolean;
  onAddAvailability: (availabilityData: Partial<BookingTemplateAvailability>) => void;
  onDeleteAvailability: (availabilityId: string) => void;
  onAddException: (exceptionData: Partial<BookingTemplateException>) => void;
  onDeleteException: (exceptionId: string) => void;
  isAddingAvailability: boolean;
  isDeletingAvailability: boolean;
  isAddingException: boolean;
  isDeletingException: boolean;
}

const DAYS_OF_WEEK = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

const TemplateAvailabilityManager: React.FC<TemplateAvailabilityManagerProps> = ({
  isOpen,
  onClose,
  template,
  availability,
  exceptions,
  isLoadingAvailability,
  isLoadingExceptions,
  onAddAvailability,
  onDeleteAvailability,
  onAddException,
  onDeleteException,
  isAddingAvailability,
  isDeletingAvailability,
  isAddingException,
  isDeletingException
}) => {
  const [activeTab, setActiveTab] = useState("recurring");
  const [dayOfWeek, setDayOfWeek] = useState("1"); // Monday by default
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleAddAvailability = () => {
    onAddAvailability({
      template_id: template.id,
      day_of_week: parseInt(dayOfWeek),
      start_time: startTime,
      end_time: endTime,
      is_available: true
    });
  };

  const handleAddException = () => {
    if (selectedDate) {
      onAddException({
        template_id: template.id,
        exception_date: format(selectedDate, "yyyy-MM-dd"),
        is_available: false
      });
      setSelectedDate(undefined);
    }
  };

  // Group availability by day of week
  const availabilityByDay = DAYS_OF_WEEK.map(day => {
    const slots = availability.filter(a => a.day_of_week === parseInt(day.value));
    return {
      day,
      slots
    };
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Availability - {template.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="recurring" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recurring">Recurring Availability</TabsTrigger>
            <TabsTrigger value="exceptions">Date Exceptions</TabsTrigger>
          </TabsList>

          <TabsContent value="recurring" className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-1/3">
                  <Label htmlFor="day-select">Day of Week</Label>
                  <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                    <SelectTrigger id="day-select">
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-1/3">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div className="w-full sm:w-1/3">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={handleAddAvailability}
                disabled={isAddingAvailability}
              >
                {isAddingAvailability ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Availability
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              {isLoadingAvailability ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                availabilityByDay.map(({ day, slots }) => (
                  <Card key={day.value} className={slots.length === 0 ? "border-dashed opacity-70" : ""}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">{day.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {slots.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No availability set</p>
                      ) : (
                        <ul className="space-y-2">
                          {slots.map((slot) => (
                            <li key={slot.id} className="flex items-center justify-between">
                              <span className="text-sm">
                                {slot.start_time} - {slot.end_time}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteAvailability(slot.id)}
                                disabled={isDeletingAvailability}
                              >
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="exceptions" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Unavailable Dates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select dates when this template will not be available (e.g., holidays, days off)
                </p>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="border rounded-md p-2"
                />
                <Button 
                  className="w-full mt-4"
                  onClick={handleAddException}
                  disabled={!selectedDate || isAddingException}
                >
                  {isAddingException ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Mark Date as Unavailable
                    </>
                  )}
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Unavailable Dates</h3>
                {isLoadingExceptions ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : exceptions.length === 0 ? (
                  <div className="border rounded-md p-6 text-center">
                    <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No exceptions set</p>
                  </div>
                ) : (
                  <ul className="border rounded-md divide-y">
                    {exceptions.map((exception) => (
                      <li key={exception.id} className="flex items-center justify-between p-3">
                        <span>
                          {new Date(exception.exception_date).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteException(exception.id)}
                          disabled={isDeletingException}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateAvailabilityManager;
