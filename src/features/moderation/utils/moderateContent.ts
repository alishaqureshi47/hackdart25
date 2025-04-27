import { ModerationRepository } from "../repositories/moderation.repository";

export async function moderateContent(text: string): Promise<{ isFlagged: boolean; reasons: Map<string, number> }> {
  // Validate the input text
  if (!text || text.trim().length === 0) {
    return {
      isFlagged: true,
      reasons: new Map([["Invalid input", 1]]),
    };
  }

  // Create an instance of the ModerationRepository
  const moderationRepo = new ModerationRepository();

  // Directly return the result from the repository
  return moderationRepo.moderateContent(text);
}