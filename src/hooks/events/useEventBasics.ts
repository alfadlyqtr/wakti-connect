
import { useState, useCallback } from "react";
import { EventCustomization } from "@/types/event.types";

export const useEventBasics = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [activeTab, setActiveTab] = useState("details");

  // Default customization state
  const [customization, setCustomization] = useState<EventCustomization>({
    background: {
      type: 'color',
      value: '#ffffff',
    },
    font: {
      family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      size: 'medium',
      color: '#333333',
    },
    buttons: {
      accept: {
        background: '#4CAF50',
        color: '#ffffff',
        shape: 'rounded',
      },
      decline: {
        background: '#f44336',
        color: '#ffffff',
        shape: 'rounded',
      }
    },
    headerStyle: 'simple',
    animation: 'fade',
  });

  const handleNextTab = useCallback(() => {
    if (activeTab === "details") setActiveTab("customize");
    else if (activeTab === "customize") setActiveTab("share");
  }, [activeTab]);

  const handlePrevTab = useCallback(() => {
    if (activeTab === "share") setActiveTab("customize");
    else if (activeTab === "customize") setActiveTab("details");
  }, [activeTab]);

  return {
    title,
    setTitle,
    description,
    setDescription,
    isAllDay,
    setIsAllDay,
    selectedDate,
    setSelectedDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    activeTab,
    setActiveTab,
    customization,
    setCustomization,
    handleNextTab,
    handlePrevTab
  };
};
