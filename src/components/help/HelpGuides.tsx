
import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { helpGuidesData } from "./helpData";

interface HelpGuidesProps {
  searchQuery: string;
  accountType: "free" | "individual" | "business";
}

export const HelpGuides = ({ searchQuery, accountType }: HelpGuidesProps) => {
  const filteredGuides = useMemo(() => {
    return helpGuidesData.filter((guide) => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          guide.title.toLowerCase().includes(query) ||
          guide.description.toLowerCase().includes(query)
        );
      }
      
      // Filter by account type
      return guide.forAccountTypes.includes('all') || guide.forAccountTypes.includes(accountType as "free" | "individual" | "business");
    });
  }, [searchQuery, accountType]);

  if (filteredGuides.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No guides match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Guides & Tutorials</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{guide.title}</CardTitle>
                {guide.forAccountTypes[0] !== 'all' && (
                  <Badge variant="outline" className="capitalize">
                    {guide.forAccountTypes.map(type => type).join(', ')}
                  </Badge>
                )}
              </div>
              <CardDescription>{guide.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-black/5 rounded-md overflow-hidden">
                <img 
                  src={guide.thumbnailUrl || "/placeholder.svg"} 
                  alt={guide.title}
                  className="object-cover w-full h-full"
                />
                {guide.videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button variant="secondary" size="icon" className="rounded-full bg-white/90 hover:bg-white">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href={guide.url} target="_blank" rel="noopener noreferrer">
                  <span>Open Guide</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
