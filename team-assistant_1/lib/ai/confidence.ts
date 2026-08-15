export const LOW_CONFIDENCE_THRESHOLD = 0.7;

export function isLowConfidence(confidence: number | null): boolean {
  return confidence !== null && confidence < LOW_CONFIDENCE_THRESHOLD;
}
