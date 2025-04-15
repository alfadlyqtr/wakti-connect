
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Calendar, CheckSquare, BriefcaseBusiness, Shield } from 'lucide-react';
import { UserRole } from '@/types/user';
import { useTaskContext } from '@/contexts/TaskContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AppleStyleHeaderProps {
  userRole: "free" | "individual" | "business" | "staff" | "super-admin";
}

const AppleStyleHeader: React.FC<AppleStyleHeaderProps> = ({ userRole }) => {
  const { user } = useAuth();
  const { tasks } = useTaskContext();
  
  // Count completed and remaining tasks
  const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
  const remainingTasks = tasks?.filter(task => task.status !== 'completed').length || 0;
  
  // Get today's date in format "April 15, 2025"
  const todayFormatted = format(new Date(), 'MMMM d, yyyy');
  
  // Determine dashboard type based on user role
  const getDashboardTitle = (role: typeof userRole) => {
    switch(role) {
      case 'business': return 'Business Dashboard';
      case 'staff': return 'Staff Dashboard';
      case 'super-admin': return 'Super Admin Dashboard';
      case 'individual': return 'Personal Dashboard';
      default: return 'WAKTI Dashboard';
    }
  };
  
  // Get role display name
  const getRoleDisplayName = (role: typeof userRole) => {
    switch(role) {
      case 'business': return 'Business Account';
      case 'staff': return 'Staff Member';
      case 'super-admin': return 'Super Administrator';
      case 'individual': return 'Individual Account';
      default: return 'Free Account';
    }
  };
  
  // Get icon based on role
  const RoleIcon = () => {
    switch(userRole) {
      case 'business': return <BriefcaseBusiness className="h-5 w-5 text-blue-400" />;
      case 'staff': return <BriefcaseBusiness className="h-5 w-5 text-green-400" />;
      case 'super-admin': return <Shield className="h-5 w-5 text-red-400" />;
      default: return <CheckSquare className="h-5 w-5 text-purple-400" />;
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-900/80 to-blue-800/80 backdrop-blur-md p-5 rounded-xl border border-blue-700/30 shadow-lg mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-1">{getDashboardTitle(userRole)}</h1>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <div className="flex items-center text-blue-200 text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Today: {todayFormatted}</span>
            </div>
            <div className="flex items-center text-blue-200 text-sm">
              <CheckSquare className="h-4 w-4 mr-2" />
              <span>{completedTasks} done, {remainingTasks} remaining</span>
            </div>
            <div className="flex items-center text-blue-200 text-sm">
              <RoleIcon />
              <span className="ml-2">{getRoleDisplayName(userRole)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-white font-medium">{user.email}</p>
                <p className="text-blue-200 text-xs">{getRoleDisplayName(userRole)}</p>
              </div>
              <Avatar className="h-12 w-12 border-2 border-white/20">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppleStyleHeader;
