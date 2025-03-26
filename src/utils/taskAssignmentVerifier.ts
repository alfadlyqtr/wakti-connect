
import { supabase } from "@/integrations/supabase/client";

/**
 * Verifies if a task has been properly assigned to a staff member
 * @param taskId The ID of the task to verify
 * @param staffId The ID of the staff member to check assignment for
 * @returns An object containing verification results
 */
export async function verifyTaskAssignment(taskId: string, staffId: string) {
  try {
    // Get the task details to check assignment
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();
      
    if (taskError) {
      console.error("Error fetching task for verification:", taskError);
      return {
        success: false,
        message: "Error fetching task details",
        error: taskError
      };
    }
    
    // Check if the task exists
    if (!taskData) {
      return {
        success: false,
        message: "Task not found",
        isAssigned: false
      };
    }
    
    // Check if the task is assigned to the specified staff member
    const isAssigned = taskData.assignee_id === staffId;
    
    return {
      success: true,
      isAssigned,
      taskData,
      message: isAssigned ? "Task is properly assigned to staff member" : "Task is not assigned to this staff member"
    };
  } catch (error) {
    console.error("Error in verifyTaskAssignment:", error);
    return {
      success: false,
      message: "Error verifying task assignment",
      error
    };
  }
}

/**
 * Gets all tasks assigned to a specific staff member
 * @param staffId The ID of the staff member
 * @returns An array of tasks assigned to the staff member
 */
export async function getTasksAssignedToStaff(staffId: string) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('assignee_id', staffId);
      
    if (error) {
      console.error("Error fetching tasks assigned to staff:", error);
      throw error;
    }
    
    return {
      success: true,
      assignedTasks: data || [],
      count: data?.length || 0
    };
  } catch (error) {
    console.error("Error in getTasksAssignedToStaff:", error);
    return {
      success: false,
      message: "Error fetching assigned tasks",
      error,
      assignedTasks: [],
      count: 0
    };
  }
}

/**
 * Verifies task assignment functionality by creating a test task and assigning it to a staff member
 * This is for testing purposes only and should not be used in production
 */
export async function testTaskAssignment(businessId: string, staffId: string) {
  try {
    // Create a test task
    const { data: taskData, error: createError } = await supabase
      .from('tasks')
      .insert({
        title: "Test Assignment Task",
        description: "This is a test task for assignment verification",
        status: "pending",
        priority: "normal",
        user_id: businessId,
        assignee_id: staffId,
        due_date: new Date(Date.now() + 86400000).toISOString() // Due tomorrow
      })
      .select()
      .single();
      
    if (createError) {
      console.error("Error creating test task:", createError);
      return {
        success: false,
        message: "Error creating test task",
        error: createError
      };
    }
    
    // Verify the assignment
    const verificationResult = await verifyTaskAssignment(taskData.id, staffId);
    
    return {
      success: true,
      task: taskData,
      verificationResult,
      message: "Test task created and assignment verified"
    };
  } catch (error) {
    console.error("Error in testTaskAssignment:", error);
    return {
      success: false,
      message: "Error testing task assignment",
      error
    };
  }
}

/**
 * Creates utility function to log assignment information for debugging
 */
export function logAssignmentStatus() {
  console.log("Task Assignment Verification Utility loaded");
  console.log("Use verifyTaskAssignment(taskId, staffId) to check if a task is properly assigned");
  console.log("Use getTasksAssignedToStaff(staffId) to get all tasks assigned to a staff member");
}

/**
 * Utility function to verify all assignments for a business
 * @param businessId The ID of the business
 */
export async function verifyAllBusinessAssignments(businessId: string) {
  try {
    // First, get all staff members for this business
    const { data: staffData, error: staffError } = await supabase
      .from('business_staff')
      .select('id, user_id')
      .eq('business_id', businessId);
      
    if (staffError) {
      throw staffError;
    }
    
    if (!staffData || staffData.length === 0) {
      return {
        success: true,
        message: "No staff members found for this business",
        assignments: []
      };
    }
    
    // For each staff member, get their assigned tasks
    const assignments = await Promise.all(
      staffData.map(async (staff) => {
        const result = await getTasksAssignedToStaff(staff.user_id);
        return {
          staffId: staff.user_id,
          staffRelationId: staff.id,
          ...result
        };
      })
    );
    
    return {
      success: true,
      message: "Successfully verified all business assignments",
      assignments,
      staffCount: staffData.length,
      totalAssignedTasks: assignments.reduce((total, curr) => total + curr.count, 0)
    };
  } catch (error) {
    console.error("Error verifying all business assignments:", error);
    return {
      success: false,
      message: "Error verifying business assignments",
      error,
      assignments: []
    };
  }
}
