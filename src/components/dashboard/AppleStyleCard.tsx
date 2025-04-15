
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  path: string;
  color?: string;
  gradient?: string;
  className?: string;
}

const AppleStyleCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  path,
  color = "bg-blue-600",
  gradient = "from-blue-700/80 to-blue-900/80",
  className
}) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 backdrop-blur-md border border-white/10 hover:shadow-lg",
      `bg-gradient-to-br ${gradient}`,
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${color} bg-opacity-20`}>
            {icon}
          </div>
          <CardTitle className="text-lg text-white">{title}</CardTitle>
        </div>
        <Button asChild size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0 text-white hover:bg-white/10">
          <Link to={path}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Open {title}</span>
          </Link>
        </Button>
      </CardHeader>
      {description && (
        <CardContent className="text-sm text-blue-100 pt-0">
          {description}
        </CardContent>
      )}
    </Card>
  );
};

export default AppleStyleCard;
