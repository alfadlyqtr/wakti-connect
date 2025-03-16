
import { Appointment } from "@/types/appointment.types";

export function filterAppointments(
  appointments: Appointment[],
  searchQuery: string = "",
  filterStatus: string = "all",
  filterDate: Date | null = null
): Appointment[] {
  return appointments.filter((appointment) => {
    // Search filter
    const matchesSearch = searchQuery 
      ? appointment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (appointment.description && appointment.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    // Status filter
    const matchesStatus = filterStatus === "all" ? true : appointment.status === filterStatus;
    
    // Date filter
    const matchesDate = !filterDate ? true : new Date(appointment.start_time).toDateString() === filterDate.toDateString();
    
    return matchesSearch && matchesStatus && matchesDate;
  });
}
