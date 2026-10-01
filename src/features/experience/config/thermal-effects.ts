import type { AnswerValue } from "../types/question";

export const thermalEffect = {
  sceneId: "habitacion",
  questionId: "motivo_termico",
  positions: [
    { optionValue: "frescos", tone: -1 },
    { optionValue: "estable", tone: 0 },
    { optionValue: "calidos", tone: 1 },
  ],
} as const;

// Preserve multi-selection: opposite intentions balance, stable softens the tint.
export function thermalTone(answer: AnswerValue | undefined): number {
  if (!Array.isArray(answer)) return 0;
  const selected = thermalEffect.positions.filter(({ optionValue }) => answer.includes(optionValue));
  return selected.length ? selected.reduce((sum, option) => sum + option.tone, 0) / selected.length : 0;
}
