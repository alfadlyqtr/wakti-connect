
import { updateProfileAvatar } from "@/services/profile/updateProfileService";

/**
 * Handles staff avatar upload
 * @param userId User ID to associate with the avatar
 * @param avatar File to upload
 * @returns Promise with the avatar URL or null if upload failed
 */
export const uploadStaffAvatar = async (userId: string, avatar?: File): Promise<string | null> => {
  if (!avatar) return null;
  
  try {
    const avatarUrl = await updateProfileAvatar(userId, avatar);
    return avatarUrl;
  } catch (error) {
    console.error("Error uploading staff avatar:", error);
    return null;
  }
};
