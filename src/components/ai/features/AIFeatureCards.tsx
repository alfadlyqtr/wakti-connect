
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Sparkles, History } from "lucide-react";

export const AIFeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <Card className="bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <MessageCircle className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-medium">Smart Conversations</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            AI remembers your preferences and adapts to your communication style.
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="font-medium">Personalized Assistance</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Get recommendations and insights tailored to your specific needs.
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
              <History className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="font-medium">Continuous Learning</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            AI gets better with each interaction to serve you more effectively.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
