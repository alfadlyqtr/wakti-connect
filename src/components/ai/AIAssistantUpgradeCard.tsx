
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export function AIAssistantUpgradeCard() {
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-wakti-blue" />
          <span>WAKTI AI Assistant</span>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
        <CardDescription>
          Unlock AI-powered productivity features with Individual or Business plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <h3 className="font-medium mb-2">What you'll get with WAKTI AI:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-wakti-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-wakti-blue text-xs">✓</span>
              </div>
              <span>Smart task scheduling and optimization</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-wakti-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-wakti-blue text-xs">✓</span>
              </div>
              <span>Event planning assistance and suggestions</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-wakti-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-wakti-blue text-xs">✓</span>
              </div>
              <span>Staff management and workload optimization</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-wakti-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-wakti-blue text-xs">✓</span>
              </div>
              <span>Analytics insights and performance recommendations</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-wakti-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-wakti-blue text-xs">✓</span>
              </div>
              <span>Customizable AI personality and behavior</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/dashboard/settings">
            Upgrade your plan
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
