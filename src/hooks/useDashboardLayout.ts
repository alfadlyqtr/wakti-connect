
import { useState } from 'react';
import { DashboardWidgetLayout } from "@/types/dashboard";

export const useDashboardLayout = () => {
  const [layout, setLayout] = useState<DashboardWidgetLayout[]>([]);

  return {
    layout,
    setLayout,
  };
};
