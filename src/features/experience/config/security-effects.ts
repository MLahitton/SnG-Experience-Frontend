import type { AnswerValue } from "../types/question";

export type SecurityVisualMode = "envelope" | "access" | "threshold";
export const securityEffect = {
  sceneId: "habitacion",
  questionId: "motivo_seguridad",
  modes: { sola: "envelope", accesos: "access", habitantes: "threshold" } as Readonly<Record<string, SecurityVisualMode>>,
};

// Every selected option owns an independent visual layer.
export function securityModes(answer: AnswerValue | undefined): SecurityVisualMode[] {
  if (!Array.isArray(answer)) return [];
  return [...new Set(answer.flatMap((value) => {
    const mode = securityEffect.modes[value];
    return mode ? [mode] : [];
  }))];
}
