
import { useState } from "react";

export function useConfirmDialog<T>() {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  
  const openDialog = (item: T) => {
    setItemToDelete(item);
    setIsOpen(true);
  };
  
  const confirmDelete = () => {
    setIsOpen(false);
  };
  
  const cancelDelete = () => {
    setIsOpen(false);
    setItemToDelete(null);
  };
  
  return {
    isOpen,
    itemToDelete,
    openDialog,
    confirmDelete,
    cancelDelete,
  };
}
