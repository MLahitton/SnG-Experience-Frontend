export interface ExperienceAudioConfig {
  source?: string;
  baseVolume: number;
  loop: boolean;
}

export const experienceAudioConfig: ExperienceAudioConfig = {
  source: "/experience/audio/ambient.mp3",
  baseVolume: 1,
  loop: true,
};
