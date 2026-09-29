import type { ReactNode } from "react";
import Image from "next/image";
import type { ExperienceSceneConfig } from "@/features/experience/types/experience";
import type { Answers, AnswerValue, Question, QuestionId } from "@/features/experience/types/question";
import { QuestionRenderer } from "@/features/experience/components/question-renderer";

interface ExperienceSceneProps {
  scene: ExperienceSceneConfig;
  groupId: string;
  groupProgress: string;
  navigation: ReactNode;
  questions: readonly Question[];
  answers: Answers;
  onAnswerChange: (id: QuestionId, value: AnswerValue) => void;
}

export function ExperienceScene({ scene, questions, answers, onAnswerChange, groupId, groupProgress, navigation }: ExperienceSceneProps) {
  return (
    <section aria-labelledby="scene-title" className="relative grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,3fr)] gap-3 overflow-hidden px-3 pb-3 sm:px-6 sm:pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:grid-rows-1 lg:gap-10 lg:px-10 lg:py-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[#343b37]">
        {scene.backgroundImage ? (
          <div className="relative h-[40%] w-full lg:h-full">
            <Image
              src={scene.backgroundImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <>
            <div className="absolute inset-y-0 left-[12%] w-px bg-white/10" />
            <div className="absolute inset-y-0 left-[54%] w-px bg-white/10" />
            <div className="absolute inset-x-0 top-[62%] h-px bg-white/10" />
          </>
        )}
      </div>
      <div className="flex min-h-0 min-w-0 flex-col justify-center px-2 lg:justify-end lg:pb-8">
        <div className={scene.backgroundImage ? "w-fit max-w-full rounded-sm bg-stone-950/70 px-3 py-2 lg:p-4" : undefined}>
        <h1 id="scene-title" className="text-lg font-normal tracking-wide sm:text-xl lg:max-w-sm lg:text-2xl">
          {scene.title}
        </h1>
        {scene.description && <p className="mt-2 hidden max-w-sm text-sm leading-relaxed text-stone-300 lg:block">{scene.description}</p>}
        {!scene.backgroundImage && <p className="mt-2 text-xs text-stone-300 lg:mt-6">{scene.visualPlaceholder}</p>}
        </div>
      </div>
      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-sm border border-white/30 bg-[#f5f3ee]/98 text-stone-800 shadow-xl [color-scheme:light]">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-stone-300/70 px-5 py-3 sm:px-6">
          <p aria-live="polite" aria-atomic="true" className="text-xs font-medium tracking-wide">{groupProgress}</p>
          <p className="text-xs text-stone-600">* Campo obligatorio.</p>
        </div>
        <div key={groupId} className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5 wrap-anywhere sm:px-6">
          {questions.map((question) => (
            <QuestionRenderer key={question.id} question={question} value={answers[question.id]}
              onChange={(value) => onAnswerChange(question.id, value)} />
          ))}
        </div>
        <div className="shrink-0 border-t border-stone-300/70 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
          {navigation}
        </div>
      </div>
    </section>
  );
}
