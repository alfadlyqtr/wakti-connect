
import { fetchDefaultAppointments } from "../fetchers/defaultAppointments";
import { supabase } from "@/integrations/supabase/client";
import { createMockAppointment } from "./utils/testHelpers";
import { mapToAppointment } from "../utils/mappers";

jest.mock("@/integrations/supabase/client");
jest.mock("../utils/mappers");

describe("fetchDefaultAppointments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mapToAppointment as jest.Mock).mockImplementation((appt) => appt);
  });

  it("should fetch appointments and apply limit for free users", async () => {
    // Setup mock response
    const mockAppointments = [
      createMockAppointment({ id: "1" }),
      createMockAppointment({ id: "2" })
    ];
    
    // Mock Supabase response
    const mockSelect = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockReturnThis();
    const mockLimit = jest.fn().mockReturnThis();
    const mockThen = jest.fn().mockResolvedValue({ data: mockAppointments, error: null });
    
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect
    });
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ limit: mockLimit, then: mockThen });
    mockLimit.mockReturnValue({ then: mockThen });
    
    // Call the function with a free user
    const result = await fetchDefaultAppointments("free");
    
    // Verify limit was called for free user
    expect(mockLimit).toHaveBeenCalledWith(5);
    expect(result).toEqual(mockAppointments);
    expect(mapToAppointment).toHaveBeenCalledTimes(mockAppointments.length);
  });
  
  it("should not apply limit for individual users", async () => {
    // Setup mock response
    const mockAppointments = [
      createMockAppointment({ id: "1" }),
      createMockAppointment({ id: "2" })
    ];
    
    // Mock Supabase response
    const mockSelect = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockReturnThis();
    const mockThen = jest.fn().mockResolvedValue({ data: mockAppointments, error: null });
    
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect
    });
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ then: mockThen });
    
    // Call the function with an individual user
    const result = await fetchDefaultAppointments("individual");
    
    // Verify correct results and no limit
    expect(result).toEqual(mockAppointments);
    expect(mapToAppointment).toHaveBeenCalledTimes(mockAppointments.length);
  });
  
  it("should handle errors gracefully", async () => {
    // Mock an error response
    const mockError = new Error("Database error");
    const mockSelect = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockReturnThis();
    const mockThen = jest.fn().mockResolvedValue({ data: null, error: mockError });
    
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect
    });
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ then: mockThen });
    
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Call the function
    const result = await fetchDefaultAppointments("business");
    
    // Verify error handling
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toEqual([]);
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
