
import { fetchBookings } from "./fetchService";
import { createBooking as createBookingService } from "./createService";
import { 
  fetchBookingTemplates,
  fetchBookingTemplate,
  createBookingTemplate,
  updateBookingTemplate,
  deleteBookingTemplate,
  fetchTemplateAvailability,
  addTemplateAvailability,
  updateTemplateAvailability,
  deleteTemplateAvailability,
  fetchTemplateExceptions,
  addTemplateException,
  deleteTemplateException,
  fetchAvailableTimeSlots,
  publishTemplate
} from "./templates";

import { 
  BookingWithRelations, 
  BookingFormData, 
  BookingTab, 
  BookingStatus, 
  BookingTemplate, 
  BookingTemplateWithRelations, 
  BookingTemplateAvailability, 
  BookingTemplateException, 
  BookingTemplateFormData, 
  BookingTemplatesResult 
} from "@/types/booking.types";

export {
  // Booking operations
  fetchBookings,
  createBookingService as createBooking,
  
  // Template operations
  fetchBookingTemplates,
  fetchBookingTemplate,
  createBookingTemplate,
  updateBookingTemplate,
  deleteBookingTemplate,
  fetchTemplateAvailability,
  addTemplateAvailability,
  updateTemplateAvailability,
  deleteTemplateAvailability,
  fetchTemplateExceptions,
  addTemplateException,
  deleteTemplateException,
  fetchAvailableTimeSlots,
  publishTemplate,
  
  // Re-export types
  type BookingWithRelations,
  type BookingFormData,
  type BookingTab,
  type BookingStatus,
  type BookingTemplate,
  type BookingTemplateWithRelations,
  type BookingTemplateAvailability,
  type BookingTemplateException,
  type BookingTemplateFormData,
  type BookingTemplatesResult
};
