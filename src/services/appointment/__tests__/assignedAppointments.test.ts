
import { fetchAssignedAppointments } from "../fetchers/assignedAppointments";
import { supabase } from "@/integrations/supabase/client";
import { createMockAppointment } from "./utils/testHelpers";
import { validateAppointmentStatus } from "../utils/statusValidator";

jest.mock("@/integrations/supabase/client");
jest.mock("../utils/statusValidator");

describe("fetchAssignedAppointments", () => {
  const userId = "user-123";
  
  beforeEach(() => {
    jest.clearAllMocks();
    (validateAppointmentStatus as jest.Mock).mockImplementation((status) => status);
    
    // Setup auth mock
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });
  });

  it("should return empty array for free users", async () => {
    const result = await fetchAssignedAppointments("free");
    expect(result).toEqual([]);
  });

  it("should fetch appointments assigned to the current user", async () => {
    // Setup mock data
    const mockAppointments = [
      { 
        ...createMockAppointment({ id: "1", assignee_id: userId }),
        user: { id: "other-user", email: "other@example.com", display_name: "Other User" },
        assignee: { id: userId, email: "test@example.com", display_name: "Test User" }
      }
    ];
    
    // Mock Supabase response
    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockReturnThis();
    const mockThen = jest.fn().mockResolvedValue({ data: mockAppointments, error: null });
    
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect
    });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ then: mockThen });
    
    // Call the function
    const result = await fetchAssignedAppointments("individual");
    
    // Verify the response
    expect(mockEq).toHaveBeenCalledWith('assignee_id', userId);
    expect(mockOrder).toHaveBeenCalledWith('start_time', { ascending: true });
    expect(result.length).toBe(mockAppointments.length);
    expect(validateAppointmentStatus).toHaveBeenCalledWith(mockAppointments[0].status);
  });
  
  it("should handle database error gracefully", async () => {
    // Mock database error
    const mockError = new Error("Database error");
    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockReturnThis();
    const mockThen = jest.fn().mockResolvedValue({ data: null, error: mockError });
    
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect
    });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ then: mockThen });
    
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Call the function
    const result = await fetchAssignedAppointments("individual");
    
    // Verify error handling
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
