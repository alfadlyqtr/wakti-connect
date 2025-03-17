
import { fetchSharedAppointments } from "../fetchers/sharedAppointments";
import { supabase } from "@/integrations/supabase/client";
import { createMockAppointment } from "./utils/testHelpers";
import { validateAppointmentStatus } from "../utils/statusValidator";

jest.mock("@/integrations/supabase/client");
jest.mock("../utils/statusValidator");

describe("fetchSharedAppointments", () => {
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
    const result = await fetchSharedAppointments("free");
    expect(result).toEqual([]);
  });

  it("should fetch appointments shared with the current user", async () => {
    // Setup mock data
    const mockAppointment = createMockAppointment({ id: "1" });
    const mockInvitations = [
      {
        appointment_id: mockAppointment.id,
        status: "accepted",
        invited_user_id: userId,
        appointment: {
          ...mockAppointment,
          user: { id: "other-user", email: "other@example.com", display_name: "Other User" },
          assignee: null
        }
      }
    ];
    
    // Mock Supabase response
    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockEq2 = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockReturnThis();
    const mockThen = jest.fn().mockResolvedValue({ data: mockInvitations, error: null });
    
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect
    });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ eq: mockEq2 });
    mockEq2.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ then: mockThen });
    
    // Call the function
    const result = await fetchSharedAppointments("individual");
    
    // Verify the response
    expect(mockEq).toHaveBeenCalledWith('invited_user_id', userId);
    expect(mockEq2).toHaveBeenCalledWith('status', 'accepted');
    expect(result.length).toBe(1);
    expect(validateAppointmentStatus).toHaveBeenCalled();
  });
  
  it("should handle error when no authenticated user", async () => {
    // Mock no authenticated user
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null }
    });
    
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Call the function
    const result = await fetchSharedAppointments("individual");
    
    // Verify error handling
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
