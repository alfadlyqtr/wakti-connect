
import { fetchMyAppointments } from "../fetchers/myAppointments";
import { supabase } from "@/integrations/supabase/client";
import { createMockAppointment } from "./utils/testHelpers";
import { validateAppointmentStatus } from "../utils/statusValidator";

jest.mock("@/integrations/supabase/client");
jest.mock("../utils/statusValidator");

describe("fetchMyAppointments", () => {
  const userId = "user-123";
  
  beforeEach(() => {
    jest.clearAllMocks();
    (validateAppointmentStatus as jest.Mock).mockImplementation((status) => status);
    
    // Setup auth mock
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });
  });

  it("should fetch appointments for the current user", async () => {
    // Setup mock data
    const mockAppointments = [
      { ...createMockAppointment({ id: "1" }), user: { id: "user-123", email: "test@example.com", display_name: "Test User" } },
      { ...createMockAppointment({ id: "2" }), user: { id: "user-123", email: "test@example.com", display_name: "Test User" } }
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
    const result = await fetchMyAppointments("individual");
    
    // Verify the response
    expect(mockEq).toHaveBeenCalledWith('user_id', userId);
    expect(result.length).toBe(mockAppointments.length);
    expect(localStorage.setItem).toHaveBeenCalledWith('userId', userId);
  });
  
  it("should limit results for free users", async () => {
    // Mock Supabase response
    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockReturnThis();
    const mockLimit = jest.fn().mockReturnThis();
    const mockThen = jest.fn().mockResolvedValue({ data: [], error: null });
    
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect
    });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ limit: mockLimit, then: mockThen });
    mockLimit.mockReturnValue({ then: mockThen });
    
    // Call the function with a free user
    await fetchMyAppointments("free");
    
    // Verify limit was called
    expect(mockLimit).toHaveBeenCalledWith(5);
  });
  
  it("should handle error when no authenticated user", async () => {
    // Mock no authenticated user
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null }
    });
    
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Call the function
    const result = await fetchMyAppointments("individual");
    
    // Verify error handling
    expect(consoleErrorSpy).toHaveBeenCalledWith("fetchMyAppointments: No authenticated user found");
    expect(result).toEqual([]);
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
  
  it("should handle database error", async () => {
    // Mock auth session
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });
    
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
    const result = await fetchMyAppointments("individual");
    
    // Verify error handling
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
