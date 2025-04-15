import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Paintbrush, Sun, Moon } from 'lucide-react';

// Keep track of the theme in localStorage
const saveTheme = (theme: string) => {
  localStorage.setItem('dashboardTheme', theme);
};

// Get the saved theme
const getSavedTheme = (): string => {
  return localStorage.getItem('dashboardTheme') || 'blue-dark';
};

interface ThemeCustomizerProps {
  onThemeChange: (theme: string) => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ onThemeChange }) => {
  const [currentTheme, setCurrentTheme] = useState(getSavedTheme());
  
  const themes = [
    { id: 'blue-dark', name: 'Blue Dark', icon: <Moon className="h-4 w-4" />, color: 'bg-blue-700' },
    { id: 'purple-dark', name: 'Purple Dark', icon: <Moon className="h-4 w-4" />, color: 'bg-purple-700' },
    { id: 'blue-light', name: 'Blue Light', icon: <Sun className="h-4 w-4" />, color: 'bg-blue-400' },
    { id: 'green-light', name: 'Green Light', icon: <Sun className="h-4 w-4" />, color: 'bg-green-400' },
  ];
  
  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    saveTheme(themeId);
    onThemeChange(themeId);
  };
  
  return (
    <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-white/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
        <div className="flex items-center gap-2">
          <Paintbrush className="h-5 w-5 text-white" />
          <CardTitle className="text-lg text-white">Dashboard Theme</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-300 mb-4">Select a theme for your dashboard experience</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {themes.map(theme => (
            <Button 
              key={theme.id}
              variant={currentTheme === theme.id ? "default" : "outline"}
              className={`flex items-center gap-2 ${currentTheme === theme.id ? 'border-2 border-white' : 'border border-white/30'}`}
              onClick={() => handleThemeChange(theme.id)}
            >
              <div className={`h-3 w-3 rounded-full ${theme.color}`}></div>
              <span className="text-white text-xs">{theme.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeCustomizer;
