"use client";

import { useState } from "react";
import { ExperienceScene } from "@/features/experience/components/experience-scene";
import { scenes } from "@/features/experience/config/scenes";
import { questions } from "@/features/experience/config/questions";
import { isAnswerValid, isQuestionVisible } from "@/features/experience/types/question";
import type { Answers, AnswerValue, QuestionId } from "@/features/experience/types/question";

const orderedScenes = [...scenes].sort((a, b) => a.order - b.order);
const buttonClassName =
  "rounded border px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-40";

export function ExperienceFlow() {
  const [currentSceneId, setCurrentSceneId] = useState(orderedScenes[0].id);
  const [answers, setAnswers] = useState<Answers>({});
  const currentIndex = orderedScenes.findIndex(
    (scene) => scene.id === currentSceneId,
  );
  const currentScene = orderedScenes[currentIndex];
  const previousScene = orderedScenes[currentIndex - 1];
  const nextScene = orderedScenes.find(
    (scene) => scene.id === currentScene.nextSceneId,
  );
  const sceneQuestions = questions
    .filter((question) => question.sceneId === currentScene.id && isQuestionVisible(question, answers))
    .sort((a, b) => a.order - b.order);
  const canAdvance = sceneQuestions.every((question) => isAnswerValid(question, answers[question.id]));

  function handleAnswerChange(id: QuestionId, value: AnswerValue) {
    setAnswers((previous) => {
      const updated = { ...previous, [id]: value };
      for (const question of questions) {
        if (question.clearWhenHidden && !isQuestionVisible(question, updated)) {
          delete updated[question.id];
        }
      }
      return updated;
    });
  }

  return (
    <main lang="es" className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-8">
      <div className="space-y-6">
        <p aria-live="polite" aria-atomic="true">
          Paso {currentIndex + 1} de {orderedScenes.length}
        </p>
        <p className="text-sm">* Campo obligatorio.</p>
        <ExperienceScene scene={currentScene} questions={sceneQuestions} answers={answers} onAnswerChange={handleAnswerChange} />
      </div>
      {!canAdvance && <p className="text-sm" role="status">Completa las preguntas obligatorias visibles{nextScene ? " para continuar" : ""}.</p>}
      <nav aria-label="Navegación del recorrido" className="flex flex-wrap justify-between gap-4">
        <button
          type="button"
          className={buttonClassName}
          disabled={!previousScene}
          onClick={() => {
            if (previousScene) setCurrentSceneId(previousScene.id);
          }}
        >
          Anterior
        </button>
        <button
          type="button"
          className={buttonClassName}
          disabled={!nextScene || !canAdvance}
          onClick={() => {
            if (nextScene && canAdvance) setCurrentSceneId(nextScene.id);
          }}
        >
          Siguiente
        </button>
      </nav>
    </main>
  );
}
