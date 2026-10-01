// Factors multiply the configured base volume; diagnosis values remain unchanged.
export const questionAudioEffects: Readonly<Record<string, { factors: Readonly<Record<number, number>>; duration: number }>> = {
  acustico: { factors: { 1: 1, 2: 0.8, 3: 0.6, 4: 0.35, 5: 0.15 }, duration: 0.25 },
};
