
import { useState } from "react";
import { StaffMember } from "@/types/staff";

export const useStaffDialogs = () => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toggleStatusConfirmOpen, setToggleStatusConfirmOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const openDeleteDialog = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setDeleteConfirmOpen(true);
  };

  const openToggleStatusDialog = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setToggleStatusConfirmOpen(true);
  };

  const closeDialogs = () => {
    setDeleteConfirmOpen(false);
    setToggleStatusConfirmOpen(false);
    setSelectedStaff(null);
  };

  return {
    deleteConfirmOpen,
    toggleStatusConfirmOpen,
    selectedStaff,
    openDeleteDialog,
    openToggleStatusDialog,
    closeDialogs,
    setDeleteConfirmOpen,
    setToggleStatusConfirmOpen
  };
};
