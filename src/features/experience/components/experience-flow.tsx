"use client";

import { useState } from "react";
import { ExperienceScene } from "@/features/experience/components/experience-scene";
import { scenes } from "@/features/experience/config/scenes";
import { questions } from "@/features/experience/config/questions";
import { questionGroups } from "@/features/experience/config/question-groups";
import { isAnswerValid, isQuestionVisible } from "@/features/experience/types/question";
import type { Answers, AnswerValue, QuestionId } from "@/features/experience/types/question";

const orderedScenes = [...scenes].sort((a, b) => a.order - b.order);
const questionsById = new Map(questions.map((question) => [question.id, question]));

function getSceneGroups(sceneId: string) {
  return questionGroups.filter((group) => group.sceneId === sceneId)
    .sort((a, b) => a.order - b.order);
}

const buttonClassName =
  "min-h-11 rounded-sm px-4 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700 disabled:cursor-not-allowed disabled:opacity-40";

export function ExperienceFlow() {
  const [currentGroupId, setCurrentGroupId] = useState(getSceneGroups(orderedScenes[0].id)[0].id);
  const [answers, setAnswers] = useState<Answers>({});
  const currentGroup = questionGroups.find((group) => group.id === currentGroupId)!;
  const currentIndex = orderedScenes.findIndex(
    (scene) => scene.id === currentGroup.sceneId,
  );
  const currentScene = orderedScenes[currentIndex];
  const previousScene = orderedScenes[currentIndex - 1];
  const nextScene = orderedScenes.find(
    (scene) => scene.id === currentScene.nextSceneId,
  );
  const sceneGroups = getSceneGroups(currentScene.id);
  const currentGroupIndex = sceneGroups.findIndex((group) => group.id === currentGroupId);
  const previousSceneGroups = previousScene ? getSceneGroups(previousScene.id) : [];
  const previousGroup = sceneGroups[currentGroupIndex - 1]
    ?? previousSceneGroups[previousSceneGroups.length - 1];
  const nextGroup = sceneGroups[currentGroupIndex + 1]
    ?? (nextScene ? getSceneGroups(nextScene.id)[0] : undefined);
  const groupQuestions = currentGroup.questionIds
    .map((id) => questionsById.get(id)!)
    .filter((question) => isQuestionVisible(question, answers));
  const canAdvance = groupQuestions.every((question) => isAnswerValid(question, answers[question.id]));

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
    <main lang="es" className="isolate flex h-dvh w-full flex-col overflow-hidden bg-[#343b37] font-sans text-stone-100">
      <header className="z-10 flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-white/15 px-5 py-4 sm:px-8 lg:px-10">
        <p className="text-base font-medium tracking-wide">Steel &amp; Glass</p>
        <p aria-live="polite" aria-atomic="true" className="text-xs tracking-wide text-stone-200">
          Paso {currentIndex + 1} de {orderedScenes.length}
        </p>
      </header>
      <ExperienceScene
        scene={currentScene}
        questions={groupQuestions}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        groupId={currentGroupId}
        groupProgress={`Sección ${currentGroupIndex + 1} de ${sceneGroups.length}`}
        navigation={
          <>
            {!canAdvance && <p className="mb-3 text-xs leading-relaxed text-stone-600" role="status">Completa las preguntas obligatorias visibles{nextGroup ? " para continuar" : ""}.</p>}
      <nav aria-label="Navegación del recorrido" className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className={`${buttonClassName} border border-stone-300 text-stone-700 enabled:hover:bg-stone-200`}
          disabled={!previousGroup}
          onClick={() => {
            if (previousGroup) setCurrentGroupId(previousGroup.id);
          }}
        >
          Anterior
        </button>
        <button
          type="button"
          className={`${buttonClassName} bg-stone-800 text-stone-50 enabled:hover:bg-stone-700`}
          disabled={!nextGroup || !canAdvance}
          onClick={() => {
            if (nextGroup && canAdvance) setCurrentGroupId(nextGroup.id);
          }}
        >
          Continuar
        </button>
      </nav>
          </>
        }
      />
    </main>
  );
}
