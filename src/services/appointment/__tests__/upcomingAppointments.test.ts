
import { fetchUpcomingAppointments } from "../fetchers/upcomingAppointments";
import { supabase } from "@/integrations/supabase/client";
import { createMockAppointment } from "./utils/testHelpers";
import { mapToAppointment } from "../utils/mappers";

jest.mock("@/integrations/supabase/client");
jest.mock("../utils/mappers");

describe("fetchUpcomingAppointments", () => {
  const userId = "user-123";
  
  beforeEach(() => {
    jest.clearAllMocks();
    (mapToAppointment as jest.Mock).mockImplementation((appt) => appt);
    
    // Setup auth mock
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });
  });

  it("should fetch upcoming appointments for the current user", async () => {
    // Setup mock data
    const mockAppointments = [
      createMockAppointment({ id: "1" }),
      createMockAppointment({ id: "2" })
    ];
    
    // Mock Supabase response
    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockGte = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockReturnThis();
    const mockThen = jest.fn().mockResolvedValue({ data: mockAppointments, error: null });
    
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect
    });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ gte: mockGte });
    mockGte.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ then: mockThen });
    
    // Call the function
    const result = await fetchUpcomingAppointments("individual");
    
    // Verify the response
    expect(mockEq).toHaveBeenCalledWith('user_id', userId);
    expect(mockGte).toHaveBeenCalled(); // checking that gte was called with the current date
    expect(mockOrder).toHaveBeenCalledWith('start_time', { ascending: true });
    expect(result).toEqual(mockAppointments);
    expect(mapToAppointment).toHaveBeenCalledTimes(mockAppointments.length);
  });
  
  it("should limit results for free users", async () => {
    // Mock Supabase response
    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockGte = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockReturnThis();
    const mockLimit = jest.fn().mockReturnThis();
    const mockThen = jest.fn().mockResolvedValue({ data: [], error: null });
    
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect
    });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ gte: mockGte });
    mockGte.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ limit: mockLimit, then: mockThen });
    mockLimit.mockReturnValue({ then: mockThen });
    
    // Call the function with a free user
    await fetchUpcomingAppointments("free");
    
    // Verify limit was called
    expect(mockLimit).toHaveBeenCalledWith(3);
  });
  
  it("should handle error when no authenticated user", async () => {
    // Mock no authenticated user
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null }
    });
    
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Call the function
    const result = await fetchUpcomingAppointments("individual");
    
    // Verify error handling
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
