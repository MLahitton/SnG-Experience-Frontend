import type { AnswerValue } from "../types/question";

export const designEffect = { sceneId: "diseno", questionId: "motivo_estetica", primaryId: "estetica" } as const;
const modes = {
  desaparece: "transparency",
  integrada: "integration",
  protagonismo: "prominence",
} as const;
export type DesignAestheticMode = typeof modes[keyof typeof modes];

export function designModes(answer: AnswerValue | undefined): DesignAestheticMode[] {
  return Object.entries(modes).flatMap(([value, mode]) => answer === value ? [mode] : []);
}
