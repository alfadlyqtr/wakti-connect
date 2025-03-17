
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NotificationSettingItem from "./NotificationSettingItem";

interface NotificationSetting {
  title: string;
  description: string;
  key: string;
  checked: boolean;
}

interface NotificationSettingsCardProps {
  title: string;
  description: string;
  settings: NotificationSetting[];
  onToggle: (key: string) => void;
  onSave: () => void;
  loading: boolean;
}

const NotificationSettingsCard: React.FC<NotificationSettingsCardProps> = ({
  title,
  description,
  settings,
  onToggle,
  onSave,
  loading,
}) => {
  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-4 sm:px-6">
        {settings.map((setting) => (
          <NotificationSettingItem
            key={setting.key}
            title={setting.title}
            description={setting.description}
            checked={setting.checked}
            onCheckedChange={() => onToggle(setting.key)}
          />
        ))}
        
        <Button 
          onClick={onSave}
          className="w-full sm:w-auto"
          disabled={loading}
        >
          {loading ? "Saving..." : `Save ${title}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettingsCard;
