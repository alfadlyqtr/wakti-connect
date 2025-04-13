
import { SubTask } from "@/types/task.types";
import { NestedSubtask } from "./aiTaskParserService";

/**
 * Maps a nested subtask structure to flat subtasks with parent-child relationships
 */
export const mapNestedStructureToFlatSubtasks = (
  nestedItems: (string | NestedSubtask)[],
  taskId: string,
  parentId: string | null = null
): Partial<SubTask>[] => {
  const result: Partial<SubTask>[] = [];
  
  nestedItems.forEach((item, index) => {
    if (typeof item === 'string') {
      // Add single item as a regular subtask
      result.push({
        task_id: taskId,
        content: item,
        is_completed: false,
        is_group: false,
        parent_id: parentId
      });
    } else if (typeof item === 'object' && item !== null) {
      // This is a group or complex subtask
      const isGroup = item.subtasks && item.subtasks.length > 0;
      const content = item.content || item.title || 'Group';
      
      // Generate a temporary ID for this item that we'll use as parent ID for children
      const tempId = `temp-${Date.now()}-${index}`;
      
      // Add the group item itself
      const groupSubtask: Partial<SubTask> = {
        task_id: taskId,
        content: content,
        title: item.title,
        is_completed: item.is_completed || false,
        is_group: isGroup,
        parent_id: parentId
      };
      
      result.push(groupSubtask);
      
      // Add all children with this group as parent
      if (isGroup && item.subtasks) {
        const childSubtasks = mapNestedStructureToFlatSubtasks(
          item.subtasks,
          taskId,
          tempId
        );
        
        result.push(...childSubtasks);
      }
    }
  });
  
  return result;
};

/**
 * Utility to reconstruct a hierarchical structure from flat subtasks
 */
export const reconstructHierarchicalSubtasks = (
  flatSubtasks: SubTask[]
): (string | NestedSubtask)[] => {
  // First identify all root level items (those without parent_id)
  const rootItems = flatSubtasks.filter(item => !item.parent_id);
  
  // Create a map for quick lookup of children by parent_id
  const childrenMap = new Map<string, SubTask[]>();
  
  flatSubtasks.forEach(subtask => {
    if (subtask.parent_id) {
      if (!childrenMap.has(subtask.parent_id)) {
        childrenMap.set(subtask.parent_id, []);
      }
      childrenMap.get(subtask.parent_id)?.push(subtask);
    }
  });
  
  // Recursive function to build the tree
  const buildSubtaskTree = (items: SubTask[]): (string | NestedSubtask)[] => {
    return items.map(item => {
      const children = childrenMap.get(item.id) || [];
      
      if (item.is_group && children.length > 0) {
        // This is a group with children
        return {
          title: item.title || item.content,
          subtasks: buildSubtaskTree(children)
        };
      } else {
        // This is a leaf item
        return item.content;
      }
    });
  };
  
  return buildSubtaskTree(rootItems);
};
