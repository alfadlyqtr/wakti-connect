
import { useState, useEffect } from "react";
import { Service } from "@/types/service.types";

export function useServiceSelection(
  services: Service[],
  initialServiceId: string | null | undefined,
  setValue: (name: string, value: any) => void
) {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(initialServiceId || null);

  // Auto-fill form when a service is selected
  useEffect(() => {
    if (selectedServiceId) {
      const selectedService = services.find(service => service.id === selectedServiceId);
      if (selectedService) {
        // Auto-fill title with service name
        setValue('title', `Booking for ${selectedService.name}`);
      }
    }
  }, [selectedServiceId, services, setValue]);

  // Handle service selection
  const handleServiceSelection = (value: string) => {
    setSelectedServiceId(value === "none" ? null : value);
  };

  return {
    selectedServiceId,
    handleServiceSelection
  };
}
