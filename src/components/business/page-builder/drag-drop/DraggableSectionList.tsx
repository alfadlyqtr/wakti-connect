
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import SectionEditor from "../section-editors/SectionEditor";
import SectionActions from "../sections/SectionActions";
import { useDragDrop } from "./DragDropContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

interface DraggableSectionListProps {
  onToggleVisibility: (sectionId: string, currentVisibility: boolean) => void;
  onDeleteSection: (sectionId: string) => void;
}

const DraggableSectionList: React.FC<DraggableSectionListProps> = ({
  onToggleVisibility,
  onDeleteSection
}) => {
  const { sections, updateSectionOrder, moveSectionUpDown, isUpdating } = useDragDrop();
  const isMobile = useIsMobile();
  const [showNumberControls, setShowNumberControls] = useState(false);
  
  // Track editable section orders
  const [editableSectionOrders, setEditableSectionOrders] = useState<Record<string, number>>(
    sections.reduce((acc, section) => ({ ...acc, [section.id]: section.section_order }), {})
  );

  const handleDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // If position hasn't changed
    if (sourceIndex === destinationIndex) {
      return;
    }

    // Reorder the sections
    const reorderedSections = [...sections];
    const [removed] = reorderedSections.splice(sourceIndex, 1);
    reorderedSections.splice(destinationIndex, 0, removed);

    // Update the section orders to match their new positions
    const updatedSections = reorderedSections.map((section, index) => ({
      ...section,
      section_order: index
    }));

    // Update the section orders
    console.log('Updating section order:', updatedSections.map(s => s.section_type));
    updateSectionOrder(updatedSections);
  };

  // Handle manual section movement (for when drag-drop isn't intuitive)
  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    console.log(`Moving section ${sectionId} ${direction}`);
    
    // Use the context function to move the section
    moveSectionUpDown(sectionId, direction);
  };
  
  // Handle direct number input change
  const handleOrderChange = (sectionId: string, newOrderStr: string) => {
    const newOrder = parseInt(newOrderStr, 10);
    if (isNaN(newOrder)) return;
    
    setEditableSectionOrders(prev => ({
      ...prev,
      [sectionId]: newOrder
    }));
  };
  
  // Apply the new order
  const applyNumberedOrder = () => {
    // Create a copy of sections with new orders
    const newSections = sections.map(section => ({
      ...section,
      section_order: editableSectionOrders[section.id]
    }));
    
    // Sort by the new order
    newSections.sort((a, b) => a.section_order - b.section_order);
    
    // Normalize orders to be sequential (0, 1, 2, etc.)
    const normalizedSections = newSections.map((section, index) => ({
      ...section,
      section_order: index
    }));
    
    // Update the state
    updateSectionOrder(normalizedSections);
    setShowNumberControls(false);
  };

  if (!sections.length) {
    return (
      <div className="text-center p-4 sm:p-8 border rounded-lg">
        <p className="text-muted-foreground">No sections to display. Add a section to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      <div className="flex justify-end mb-2 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowNumberControls(!showNumberControls)}
        >
          {showNumberControls ? "Hide Order Controls" : "Show Order Controls"}
        </Button>
      </div>
      
      {showNumberControls && (
        <div className="bg-muted/20 p-4 rounded-md mb-4">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium mb-2">
              Enter position numbers (0 being the first) and click Apply to reorder sections
            </div>
            {sections.map((section) => (
              <div key={`order-${section.id}`} className="flex items-center gap-2">
                <span className="text-sm font-medium capitalize">{section.section_type}:</span>
                <input
                  type="number"
                  min="0"
                  max={sections.length - 1}
                  value={editableSectionOrders[section.id]}
                  onChange={(e) => handleOrderChange(section.id, e.target.value)}
                  className="w-16 p-1 border rounded text-sm"
                />
              </div>
            ))}
            <Button 
              size="sm" 
              onClick={applyNumberedOrder}
              className="mt-2 w-full sm:w-auto"
            >
              Apply Order
            </Button>
          </div>
        </div>
      )}
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4"
            >
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="relative"
                    >
                      <CardHeader className={isMobile ? "p-3" : "pb-2"}>
                        <div className={`flex ${isMobile ? "flex-col gap-2" : "items-center justify-between"}`}>
                          <div className="flex items-center">
                            <div 
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing p-1 mr-2 hover:bg-muted rounded touch-target"
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <CardTitle className="text-lg capitalize flex items-center">
                              {section.section_type}
                              {!section.is_visible && (
                                <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                                  Hidden
                                </span>
                              )}
                            </CardTitle>
                            <div className="flex items-center ml-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMoveSection(section.id, 'up')}
                                disabled={index === 0}
                                className="h-8 w-8"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMoveSection(section.id, 'down')}
                                disabled={index === sections.length - 1}
                                className="h-8 w-8"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <SectionActions 
                            sectionId={section.id}
                            isVisible={section.is_visible}
                            isFirstSection={index === 0}
                            isLastSection={index === sections.length - 1}
                            onToggleVisibility={onToggleVisibility}
                            onMoveSection={handleMoveSection}
                            onDeleteSection={onDeleteSection}
                          />
                        </div>
                      </CardHeader>
                      <CardContent className={isMobile ? "p-3" : undefined}>
                        <SectionEditor section={section} />
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default DraggableSectionList;
