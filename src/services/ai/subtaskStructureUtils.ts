
import { SubTask } from "@/types/task.types";
import { NestedSubtask } from "./aiTaskParserService";

/**
 * Maps a flat array of subtasks to their hierarchical structure
 * @param subtasks Flat array of subtasks with parent_id references
 * @returns A hierarchical structure of subtasks
 */
export const mapFlatSubtasksToHierarchy = (subtasks: SubTask[]): SubTask[] => {
  // Create a map of subtasks by ID for quick lookup
  const subtaskMap = new Map<string, SubTask>();
  
  // First pass: create a map of all subtasks by ID
  subtasks.forEach(subtask => {
    subtaskMap.set(subtask.id, {
      ...subtask,
      subtasks: [] // Initialize empty subtasks array
    });
  });
  
  // Group subtasks that have parent IDs
  const rootSubtasks: SubTask[] = [];
  
  // Second pass: connect parents and children
  subtasks.forEach(subtask => {
    const subtaskWithChildren = subtaskMap.get(subtask.id);
    
    if (subtask.parent_id && subtaskMap.has(subtask.parent_id)) {
      // This is a child subtask, add it to its parent
      const parent = subtaskMap.get(subtask.parent_id);
      if (parent && parent.subtasks) {
        parent.subtasks.push(subtaskWithChildren!);
      }
    } else {
      // This is a root subtask (no parent)
      rootSubtasks.push(subtaskWithChildren!);
    }
  });
  
  return rootSubtasks;
};

/**
 * Maps a hierarchical AI-parsed structure to a flat array of subtasks for storage
 * @param nestedItems AI-parsed nested subtask structure
 * @returns A flat array of subtasks with parent-child relationships
 */
export const mapNestedStructureToFlatSubtasks = (
  nestedItems: (string | NestedSubtask)[],
  taskId: string,
  parentId: string | null = null
): SubTask[] => {
  let result: SubTask[] = [];
  
  nestedItems.forEach((item, index) => {
    if (typeof item === 'string') {
      // Simple string subtask
      const subtask: SubTask = {
        id: `temp-${parentId ? `${parentId}-` : ''}${index}`,
        task_id: taskId,
        content: item,
        is_completed: false,
        parent_id: parentId
      };
      
      result.push(subtask);
    } else {
      // Group/nested subtask
      const isGroup = !!item.subtasks && item.subtasks.length > 0;
      const groupId = `temp-group-${parentId ? `${parentId}-` : ''}${index}`;
      const title = item.title || item.content || 'Task group';
      
      // Add the group itself
      const group: SubTask = {
        id: groupId,
        task_id: taskId,
        content: title,
        title: title, // Store title separately for clarity
        is_completed: false,
        is_group: isGroup,
        parent_id: parentId
      };
      
      result.push(group);
      
      // Process children if any
      if (item.subtasks && item.subtasks.length > 0) {
        const children = mapNestedStructureToFlatSubtasks(item.subtasks, taskId, groupId);
        result = [...result, ...children];
      }
    }
  });
  
  return result;
};

/**
 * Converts a flat array of subtasks to a nested structure for display
 * (Used when loading from the database)
 */
export const convertFlatSubtasksToNested = (subtasks: SubTask[]): (string | NestedSubtask)[] => {
  // Create a map of groups
  const groupMap = new Map<string, NestedSubtask>();
  const rootItems: (string | NestedSubtask)[] = [];
  
  // First pass: identify all groups
  subtasks.forEach(subtask => {
    if (subtask.is_group) {
      groupMap.set(subtask.id, {
        title: subtask.title || subtask.content,
        content: subtask.content,
        subtasks: [],
        is_completed: subtask.is_completed
      });
    }
  });
  
  // Second pass: assign items to their groups
  subtasks.forEach(subtask => {
    if (!subtask.is_group && subtask.parent_id && groupMap.has(subtask.parent_id)) {
      // This is a child of a group
      const parentGroup = groupMap.get(subtask.parent_id)!;
      if (parentGroup.subtasks) {
        parentGroup.subtasks.push(subtask.content);
      }
    } else if (!subtask.parent_id && !subtask.is_group) {
      // This is a root item (not in any group)
      rootItems.push(subtask.content);
    }
  });
  
  // Add all groups to the root items
  groupMap.forEach(group => {
    if (!rootItems.includes(group)) {
      rootItems.push(group);
    }
  });
  
  return rootItems;
};
