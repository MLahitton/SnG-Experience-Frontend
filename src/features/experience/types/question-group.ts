import type { QuestionId } from "@/features/experience/types/question";

export interface QuestionGroup {
  id: string;
  sceneId: string;
  order: number;
  questionIds: readonly QuestionId[];
}
