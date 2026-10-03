import type { AnswerValue } from "../types/question";

export const designNeutralImage = "/experience/scenes/espacio-diseno.webp";

// Enable each entry only after adding its real asset with matching camera,
// framing and resolution. Missing assets must never be replaced by duplicates.
export const designImages: Readonly<Record<string, { src: string; available: boolean }>> = {
  desaparece: { src: "/experience/scenes/espacio-diseno-transparencia.webp", available: true },
  integrada: { src: "/experience/scenes/espacio-diseno-integracion.webp", available: true },
  protagonismo: { src: "/experience/scenes/espacio-diseno-protagonismo.webp", available: true },
};

export function designImageForAnswer(answer: AnswerValue | undefined, visible: boolean): string {
  if (!visible || typeof answer !== "string") return designNeutralImage;
  const variant = designImages[answer];
  return variant?.available ? variant.src : designNeutralImage;
}
