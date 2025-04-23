
/**
 * Utilities for handling nested subtask structures
 */

import { NestedSubtask, SubTask } from "@/types/task.types";
import { v4 as uuidv4 } from "uuid";

/**
 * Maps a nested structure of subtasks to a flat array suitable for database storage
 * while preserving parent-child relationships
 */
export const mapNestedStructureToFlatSubtasks = (
  nestedItems: (string | NestedSubtask)[],
  taskId: string,
  parentId: string | null = null
): SubTask[] => {
  let flatSubtasks: SubTask[] = [];
  
  nestedItems.forEach((item, index) => {
    if (typeof item === 'string') {
      // Simple string item - generate proper UUID
      flatSubtasks.push({
        id: uuidv4(),
        task_id: taskId,
        content: item,
        is_completed: false,
        parent_id: parentId,
        is_group: false
      });
    } else {
      // Group or nested item
      const isGroup = item.subtasks && item.subtasks.length > 0;
      const title = item.title || item.content || 'Group';
      const content = item.content || item.title || 'Group';
      
      // Generate a proper UUID for this group
      const groupId = uuidv4();
      
      // Add the group itself to the flat list
      flatSubtasks.push({
        id: groupId,
        task_id: taskId,
        content: content,
        title: title,
        is_completed: item.is_completed || false,
        is_group: isGroup,
        parent_id: parentId
      });
      
      // Process child subtasks if they exist
      if (isGroup && item.subtasks) {
        // Recursively flatten all child subtasks with this group as their parent
        const childSubtasks = mapNestedStructureToFlatSubtasks(
          item.subtasks,
          taskId,
          groupId
        );
        
        // Add all children to the flat list
        flatSubtasks = [...flatSubtasks, ...childSubtasks];
      }
    }
  });
  
  return flatSubtasks;
};

/**
 * Converts a flat list of subtasks back into a nested structure
 * This is useful for displaying the hierarchical view
 */
export const reconstructNestedSubtasks = (flatSubtasks: SubTask[]): (string | NestedSubtask)[] => {
  // First identify all top-level items (those with no parent or parent_id is null)
  const topLevelItems = flatSubtasks.filter(item => !item.parent_id);
  
  // Function to recursively build the tree
  const buildSubtaskTree = (parentId: string | null): (string | NestedSubtask)[] => {
    // Get all direct children of this parent
    const children = flatSubtasks.filter(item => item.parent_id === parentId);
    
    return children.map(child => {
      // If this is a group, process its children recursively
      if (child.is_group) {
        const nestedItem: NestedSubtask = {
          title: child.title || child.content,
          content: child.content,
          is_completed: child.is_completed,
          subtasks: buildSubtaskTree(child.id)
        };
        return nestedItem;
      }
      
      // For leaf nodes (not groups), just return the content string
      return child.content;
    });
  };
  
  // Start the recursion with null parent (top level)
  return buildSubtaskTree(null);
};
