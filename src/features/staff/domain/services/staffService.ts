
import { staffRepository } from "../repositories/staffRepository";
import { StaffMember, CreateStaffParams } from "../types";

export class StaffService {
  /**
   * Gets all staff members for the business
   */
  async getStaffMembers(): Promise<StaffMember[]> {
    return await staffRepository.fetchStaffMembers();
  }
  
  /**
   * Creates a new staff member
   */
  async createStaffMember(params: CreateStaffParams): Promise<StaffMember> {
    return await staffRepository.createStaffMember(params);
  }
  
  /**
   * Updates a staff member's status
   */
  async updateStaffStatus(staffId: string, newStatus: string): Promise<boolean> {
    return await staffRepository.updateStaffStatus(staffId, newStatus);
  }
  
  /**
   * Deletes a staff member (soft delete)
   */
  async deleteStaffMember(staffId: string): Promise<boolean> {
    return await staffRepository.deleteStaffMember(staffId);
  }
  
  /**
   * Determines if business can add more staff
   * This is a business rule that belongs in the domain service
   */
  async canAddMoreStaff(): Promise<boolean> {
    try {
      const staffMembers = await this.getStaffMembers();
      
      // Current limitation is 5 staff members
      // This would be based on subscription in a real app
      return staffMembers.length < 5;
    } catch (error) {
      console.error("Error checking staff limit:", error);
      return false;
    }
  }
}

export const staffService = new StaffService();
