
import { JobCard } from "@/types/jobs.types";

export interface JobCardsResult {
  jobCards: JobCard[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  createJobCard: ReturnType<typeof import("@tanstack/react-query").useMutation>;
  updateJobCard: ReturnType<typeof import("@tanstack/react-query").useMutation>;
  completeJobCard: ReturnType<typeof import("@tanstack/react-query").useMutation>;
  deleteJobCard: ReturnType<typeof import("@tanstack/react-query").useMutation>;
}
