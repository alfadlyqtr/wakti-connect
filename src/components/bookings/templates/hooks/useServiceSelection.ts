
import { useState, useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { Service } from "@/types/service.types";

export function useServiceSelection(
  services: Service[],
  initialServiceId: string | null | undefined,
  setValue: UseFormSetValue<any>
) {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(initialServiceId || null);

  // Auto-fill form when a service is selected
  useEffect(() => {
    if (selectedServiceId) {
      const selectedService = services.find(service => service.id === selectedServiceId);
      if (selectedService) {
        setValue('duration', selectedService.duration);
        setValue('price', selectedService.price || undefined);
        if (selectedService.description) {
          setValue('description', selectedService.description);
        }
      }
    }
  }, [selectedServiceId, services, setValue]);

  // Handle service selection
  const handleServiceChange = (value: string) => {
    setSelectedServiceId(value === "none" ? null : value);
  };

  return {
    selectedServiceId,
    handleServiceChange
  };
}
