import OpenAI from "openai";
import ModerationResult from "../types/moderationTypes";

const openAiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openAiApiKey, // Load API key from environment variables
  dangerouslyAllowBrowser: true, // Allow browser usage
});

export class ModerationRepository {
  /**
   * Moderates the given content using OpenAI's Moderation API.
   * @param content - The content to be moderated.
   * @param imageUrl - Optional image URL to include in moderation.
   * @param strictnessLevel - Optional strictness setting (default: 'medium')
   * @returns A promise indicating whether the content is flagged and the reasons.
   */
  async moderateContent(
    content: string,
    imageUrl?: string,
    strictnessLevel: 'low' | 'medium' | 'high' = 'high'
  ): Promise<ModerationResult> {
    try {
      // Create moderation request based on inputs
      let moderation: OpenAI.Moderations.ModerationCreateResponse;

      if (!imageUrl) {
        moderation = await openai.moderations.create({
          model: "omni-moderation-latest",
          input: content,
        });
      } else {
        moderation = await openai.moderations.create({
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
      const categoryScores = moderation.results[0].category_scores;
      
      // Define strictness level thresholds for different categories
      const thresholds: Record<string, Record<'low' | 'medium' | 'high', number>> = {
        'sexual': { low: 0.7, medium: 0.5, high: 0.3 },
        'hate': { low: 0.7, medium: 0.5, high: 0.3 },
        'harassment': { low: 0.7, medium: 0.5, high: 0.3 },
        'self-harm': { low: 0.6, medium: 0.4, high: 0.2 },
        'sexual/minors': { low: 0.5, medium: 0.3, high: 0.1 }, // Stricter for this category
        'hate/threatening': { low: 0.6, medium: 0.4, high: 0.2 },
        'violence': { low: 0.7, medium: 0.5, high: 0.3 },
        'violence/graphic': { low: 0.6, medium: 0.4, high: 0.2 },
        // Default for any other category
        'default': { low: 0.7, medium: 0.5, high: 0.3 }
      };
      
      // Check if any category exceeds its threshold
      let isFlagged = false;
      const flaggedReasons: Map<string, number> = new Map();
      
      Object.entries(categoryScores).forEach(([category, score]) => {
        // Get threshold for this category and strictness level
        const categoryThresholds = thresholds[category] || thresholds['default'];
        const threshold = categoryThresholds[strictnessLevel];
        
        // Include in reasons if above lower threshold
        const reasonThreshold = strictnessLevel === 'high' ? 0.2 : 
                               strictnessLevel === 'medium' ? 0.3 : 0.5;
                               
        if (score > reasonThreshold) {
          flaggedReasons.set(category, score);
        }
        
        // Flag content if above main threshold
        if (score > threshold) {
          isFlagged = true;
        }
      });

      return { 
        isFlagged, 
        reasons: flaggedReasons,
        rawScores: Object.fromEntries(Object.entries(categoryScores)),
        strictnessLevel
      } as ModerationResult;
    } catch (error) {
      console.error("Error moderating content:", error);
      throw new Error("Failed to moderate content");
    }
  }
  
  /**
   * Maximum strictness moderation for sensitive applications
   */
  async moderateContentStrict(content: string, imageUrl?: string): Promise<ModerationResult> {
    // Use high strictness by default
    return this.moderateContent(content, imageUrl, 'high');
  }
}