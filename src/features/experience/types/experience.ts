export interface ExperienceSceneConfig {
  id: string;
  order: number;
  name: string;
  title: string;
  description?: string;
  visualPlaceholder: string;
  backgroundImage?: string;
  visualVariant?: "immersive";
  questionPresentation?: "single";
  questionProgressScope?: "group" | "scene";
  nextSceneId?: string;
}
