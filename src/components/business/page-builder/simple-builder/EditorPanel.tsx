
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionsTab from "./editor-tabs/SectionsTab";
import ThemeTab from "./editor-tabs/ThemeTab";
import SettingsTab from "./editor-tabs/SettingsTab";
import IntegrationsTab from "./editor-tabs/IntegrationsTab";
import { SectionType, PageSettings, BusinessPageData } from "./types";

interface EditorPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sections?: SectionType[];
  pageSettings?: PageSettings;
  setPageSettings?: (settings: PageSettings) => void;
  activeSectionIndex?: number | null;
  updateSection?: (index: number, section: SectionType) => void;
  addSection?: (type: string) => void;
  removeSection?: (index: number) => void;
  moveSectionUp?: (index: number) => void;
  moveSectionDown?: (index: number) => void;
  setActiveSectionIndex?: (index: number | null) => void;
  pageData?: BusinessPageData; // Added pageData prop
  onSectionUpdate?: (sectionKey: string, newSectionData: any) => void;
  onSave?: () => Promise<void>;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  activeTab,
  setActiveTab,
  sections,
  pageSettings,
  setPageSettings,
  activeSectionIndex,
  updateSection,
  addSection,
  removeSection,
  moveSectionUp,
  moveSectionDown,
  setActiveSectionIndex,
  pageData, // Added pageData 
  onSectionUpdate, // Added onSectionUpdate
  onSave // Added onSave
}) => {
  return (
    <div className="w-80 bg-white border-l flex flex-col h-full overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <TabsList className="w-full grid grid-cols-4 rounded-none border-b">
          <TabsTrigger value="sections" className="rounded-none">
            Sections
          </TabsTrigger>
          <TabsTrigger value="theme" className="rounded-none">
            Theme
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-none">
            Settings
          </TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-none">
            Integrations
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-auto">
          <TabsContent value="sections" className="p-0 h-full">
            {sections && activeSectionIndex !== undefined && updateSection && addSection && removeSection && 
             moveSectionUp && moveSectionDown && setActiveSectionIndex && (
              <SectionsTab 
                sections={sections}
                activeSectionIndex={activeSectionIndex}
                updateSection={updateSection}
                addSection={addSection}
                removeSection={removeSection}
                moveSectionUp={moveSectionUp}
                moveSectionDown={moveSectionDown}
                setActiveSectionIndex={setActiveSectionIndex}
              />
            )}
          </TabsContent>
          
          <TabsContent value="theme" className="p-4">
            {pageSettings && setPageSettings && (
              <ThemeTab 
                pageSettings={pageSettings} 
                setPageSettings={setPageSettings} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="p-4">
            {pageSettings && setPageSettings && (
              <SettingsTab 
                pageSettings={pageSettings} 
                setPageSettings={setPageSettings} 
                pageData={pageData}
              />
            )}
          </TabsContent>
          
          <TabsContent value="integrations" className="p-4">
            {pageSettings && setPageSettings && (
              <IntegrationsTab 
                pageSettings={pageSettings} 
                setPageSettings={setPageSettings} 
              />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default EditorPanel;
