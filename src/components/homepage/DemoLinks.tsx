
import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Image, Bot } from 'lucide-react';
import { Card } from '@/components/ui/card';

const DemoLinks = () => {
  const demos = [
    {
      title: 'Image Capture & AI Enhancement',
      description: 'Take or upload photos and enhance them with AI',
      icon: <Camera className="h-5 w-5" />,
      path: '/demos/image-capture',
      color: 'bg-purple-500'
    },
    // Add more demos here as they become available
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {demos.map((demo, index) => (
        <Link to={demo.path} key={index}>
          <Card className="p-4 hover:shadow-md transition-all border border-transparent hover:border-primary/20">
            <div className="flex items-start gap-3">
              <div className={`${demo.color} p-2 rounded-md text-white`}>
                {demo.icon}
              </div>
              <div>
                <h3 className="font-medium text-sm">{demo.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{demo.description}</p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default DemoLinks;
