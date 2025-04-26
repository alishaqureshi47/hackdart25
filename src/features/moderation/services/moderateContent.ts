import { ModerationRepository } from "../repositories/moderation.repository";

export async function moderateContent(text: string): Promise<{ approved: boolean; reason?: string }> {
  // Validate the input text
  if (!text || text.trim().length === 0) {
	return {
	  approved: false,
	  reason: "Text is empty or invalid.",
	};
  }

  // Create an instance of the ModerationRepository
  const moderationRepo = new ModerationRepository();

  // Send the text to the moderation repository
  return await moderationRepo.moderateContent(text);
}