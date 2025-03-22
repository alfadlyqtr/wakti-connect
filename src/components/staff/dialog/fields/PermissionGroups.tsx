
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PermissionGroupsProps {
  permissions: Record<string, boolean>;
  onChange: (permissions: Record<string, boolean>) => void;
}

const PermissionGroups: React.FC<PermissionGroupsProps> = ({ permissions, onChange }) => {
  const handleChange = (group: string, checked: boolean) => {
    onChange({
      ...permissions,
      [group]: checked
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="perm-tasks" 
          checked={permissions?.tasks || false}
          onCheckedChange={(checked) => handleChange('tasks', checked as boolean)}
        />
        <Label htmlFor="perm-tasks">Tasks Management</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="perm-bookings" 
          checked={permissions?.bookings || false}
          onCheckedChange={(checked) => handleChange('bookings', checked as boolean)}
        />
        <Label htmlFor="perm-bookings">Bookings Management</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="perm-services" 
          checked={permissions?.services || false}
          onCheckedChange={(checked) => handleChange('services', checked as boolean)}
        />
        <Label htmlFor="perm-services">Services Management</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="perm-reports" 
          checked={permissions?.reports || false}
          onCheckedChange={(checked) => handleChange('reports', checked as boolean)}
        />
        <Label htmlFor="perm-reports">Reports Access</Label>
      </div>
    </div>
  );
};

export default PermissionGroups;
