
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
        // Auto-fill multiple fields based on service data
        setValue('title', `${selectedService.name}`);
        setValue('description', selectedService.description || '');
        setValue('duration', selectedService.duration);
        
        // Only set price if it exists
        if (selectedService.price !== null) {
          setValue('price', selectedService.price);
        }
        
        // Default to published if linked to a service
        setValue('is_published', true);
      }
    } else {
      // Reset form fields if "None" is selected
      setValue('is_published', false);
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
