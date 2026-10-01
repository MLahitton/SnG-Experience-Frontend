import { useEffect } from "react";
import type { AnswerValue } from "@/features/experience/types/question";
import { useExperienceAudio } from "./audio-provider";
import { questionAudioEffects } from "./question-effects";

export function useQuestionAudioEffect(questionId: string | undefined, answer: AnswerValue | undefined) {
  const audio = useExperienceAudio();
  const effect = questionId ? questionAudioEffects[questionId] : undefined;
  useEffect(() => {
    if (!effect) return;
    const factor = typeof answer === "number" ? effect.factors[answer] : undefined;
    if (factor !== undefined) audio.setEffectiveVolume(audio.getSnapshot().baseVolume * factor, effect.duration);
    else audio.restoreBaseVolume(effect.duration);
    return () => audio.restoreBaseVolume(effect.duration);
  }, [audio, effect, answer]);
}
