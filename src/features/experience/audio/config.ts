export interface ExperienceAudioConfig {
  source?: string;
  baseVolume: number;
  loop: boolean;
}

// Add an approved local /experience/audio/ambient.<format> source here later.
export const experienceAudioConfig: ExperienceAudioConfig = {
  baseVolume: 0.35,
  loop: true,
};
