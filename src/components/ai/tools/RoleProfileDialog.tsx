
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAIPersonality } from '../personality-switcher/AIPersonalityContext';
import { useAISettings } from '@/components/settings/ai/context/AISettingsContext';
import { AIAssistantToolsCard } from './AIAssistantToolsCard';

interface RoleProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

const RoleProfileDialog: React.FC<RoleProfileDialogProps> = ({ open, onClose }) => {
  const { currentPersonality } = useAIPersonality();
  const { settings } = useAISettings();
  
  if (!currentPersonality || !settings) {
    return null;
  }

  // Get the assistant name from settings or use the personality name as fallback
  const assistantName = settings.assistant_name || currentPersonality.name;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span 
              className="h-3 w-3 rounded-full mr-2 animate-pulse"
              style={{ backgroundColor: currentPersonality.color }}
            />
            {assistantName}
          </DialogTitle>
          <DialogDescription>
            {currentPersonality.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <div className="rounded-md bg-muted p-4">
            <h4 className="font-medium mb-2">Specialized Knowledge</h4>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>Personalized for your {currentPersonality.mode} needs</li>
              <li>Custom instructions and knowledge base</li>
              <li>Mode-specific suggestions and workflows</li>
            </ul>
          </div>
          
          {currentPersonality.quickTools && currentPersonality.quickTools.length > 0 && (
            <AIAssistantToolsCard 
              canAccess={true} 
              selectedRole={currentPersonality.mode}
              onUseDocumentContent={() => {}} 
            />
          )}
          
          <div>
            <h4 className="font-medium mb-2">Try asking about:</h4>
            <div className="flex flex-wrap gap-2">
              {currentPersonality.suggestedPrompts.slice(0, 3).map((prompt, index) => (
                <div 
                  key={index} 
                  className="text-sm bg-accent px-3 py-1 rounded-full"
                >
                  {prompt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleProfileDialog;
