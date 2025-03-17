
import React from "react";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingItemProps {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: () => void;
}

const NotificationSettingItem: React.FC<NotificationSettingItemProps> = ({
  title,
  description,
  checked,
  onCheckedChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-1 sm:mt-0"
      />
    </div>
  );
};

export default NotificationSettingItem;
