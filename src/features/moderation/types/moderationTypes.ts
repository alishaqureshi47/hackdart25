export default interface ModerationResult { 
    isFlagged: boolean; 
    reasons: Map<string, number>;
}