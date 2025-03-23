
import { JobCardsResult } from "./types";
import { useJobCardsQuery } from "./queries";
import { 
  useCreateJobCardMutation, 
  useUpdateJobCardMutation,
  useCompleteJobCardMutation,
  useDeleteJobCardMutation
} from "./mutations";

export const useJobCards = (staffRelationId?: string): JobCardsResult => {
  const { 
    data: jobCards, 
    isLoading, 
    error, 
    refetch 
  } = useJobCardsQuery(staffRelationId);
  
  const createJobCard = useCreateJobCardMutation();
  const updateJobCard = useUpdateJobCardMutation();
  const completeJobCard = useCompleteJobCardMutation();
  const deleteJobCard = useDeleteJobCardMutation();
  
  return {
    jobCards,
    isLoading,
    error,
    refetch,
    createJobCard,
    updateJobCard,
    completeJobCard,
    deleteJobCard
  };
};
