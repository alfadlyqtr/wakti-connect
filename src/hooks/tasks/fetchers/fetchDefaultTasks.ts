
import { fetchMyTasks } from './fetchMyTasks';
import { TaskWithSharedInfo } from '../types';

export const fetchDefaultTasks = async (userId: string): Promise<TaskWithSharedInfo[]> => {
  // Default to fetching user's own tasks
  return await fetchMyTasks(userId);
};
