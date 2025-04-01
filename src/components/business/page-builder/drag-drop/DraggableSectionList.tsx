
import React from "react";
import { useDragDrop } from "./DragDropContext";
import SectionCard from "../sections/SectionCard";
import SectionActions from "../sections/SectionActions";
import { BusinessPageSection } from "@/types/business.types";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Loader2 } from "lucide-react";

interface DraggableSectionListProps {
  onToggleVisibility: (sectionId: string, currentVisibility: boolean) => void;
  onDeleteSection: (sectionId: string) => void;
}

const DraggableSectionList: React.FC<DraggableSectionListProps> = ({
  onToggleVisibility,
  onDeleteSection
}) => {
  const { sections, updateSectionOrder, isUpdating, moveSectionUpDown } = useDragDrop();
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    updateSectionOrder(items);
  };
  
  return (
    <div className="space-y-3">
      {isUpdating && (
        <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Updating section order...
        </div>
      )}
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {sections.map((section, index) => (
                <Draggable 
                  key={section.id} 
                  draggableId={section.id} 
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{...provided.draggableProps.style}}
                      className="relative"
                    >
                      <SectionCard
                        section={section}
                        displayOrder={index + 1}
                        actionsComponent={
                          <SectionActions
                            sectionId={section.id}
                            isVisible={section.is_visible}
                            isFirstSection={index === 0}
                            isLastSection={index === sections.length - 1}
                            onToggleVisibility={onToggleVisibility}
                            onDeleteSection={onDeleteSection}
                            onMoveSection={moveSectionUpDown}
                          />
                        }
                      />
                    </div>
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
