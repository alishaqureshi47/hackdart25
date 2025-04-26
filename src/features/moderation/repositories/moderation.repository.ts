import OpenAI from "openai";

export class ModerationRepository {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!, // Load API key from environment variables
    });
  }

  /**
   * Moderates the given content using OpenAI's Moderation API.
   * @param content - The content to be moderated.
   * @param imageUrl - Optional image URL to include in moderation.
   * @returns A promise indicating whether the content is flagged and the reasons.
   */
  async moderateContent(
    content: string,
    imageUrl?: string
  ): Promise<{ isFlagged: boolean; reasons: Map<string, number> }> {
    try {
      // Create moderation request based on inputs
      let moderation: OpenAI.Moderations.ModerationCreateResponse;

      if (!imageUrl) {
        moderation = await this.openai.moderations.create({
          model: "omni-moderation-latest",
          input: content,
        });
      } else {
        moderation = await this.openai.moderations.create({
          model: "omni-moderation-latest",
          input: [
            { type: "text", text: content },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        });
      }

      // Process results
      const categories = moderation.results[0].categories;
      const categoryScores = moderation.results[0].category_scores;

      // Convert categories and scores to a map of reasons
      const reasons: Map<string, number> = new Map(
        Object.entries(categoryScores).filter(([_, score]) => score > 0.5)
      );

      const isFlagged = Math.max(...Object.values(categoryScores)) > 0.95;

      return { isFlagged, reasons };
    } catch (error) {
      console.error("Error moderating content:", error);
      throw new Error("Failed to moderate content");
    }
  }
}