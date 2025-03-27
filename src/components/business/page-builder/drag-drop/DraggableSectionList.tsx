
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical, Loader2 } from "lucide-react";
import SectionEditor from "../section-editors/SectionEditor";
import SectionActions from "../sections/SectionActions";
import { useDragDrop } from "./DragDropContext";

interface DraggableSectionListProps {
  onToggleVisibility: (sectionId: string, currentVisibility: boolean) => void;
  onDeleteSection: (sectionId: string) => void;
}

const DraggableSectionList: React.FC<DraggableSectionListProps> = ({
  onToggleVisibility,
  onDeleteSection
}) => {
  const { sections, updateSectionOrder, isUpdating } = useDragDrop();

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

    // Update the section orders
    updateSectionOrder(reorderedSections);
  };

  if (!sections.length) {
    return (
      <div className="text-center p-8 border rounded-lg">
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
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing p-1 mr-2 hover:bg-muted rounded"
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
                          </div>
                          <SectionActions 
                            sectionId={section.id}
                            isVisible={section.is_visible}
                            isFirstSection={index === 0}
                            isLastSection={index === sections.length - 1}
                            onToggleVisibility={onToggleVisibility}
                            onMoveSection={() => {}} // Not needed with drag-drop
                            onDeleteSection={onDeleteSection}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
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
