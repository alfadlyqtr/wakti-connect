
import { useState } from "react";

export function useStaffSelection(initialStaffId: string | null | undefined) {
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>(
    initialStaffId ? [initialStaffId] : []
  );

  // Handle staff selection
  const handleStaffChange = (staffId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedStaffIds(prev => [...prev, staffId]);
    } else {
      setSelectedStaffIds(prev => prev.filter(id => id !== staffId));
    }
  };

  return {
    selectedStaffIds,
    handleStaffChange
  };
}
