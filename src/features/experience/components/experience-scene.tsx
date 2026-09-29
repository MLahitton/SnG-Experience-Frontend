import type { ExperienceSceneConfig } from "@/features/experience/types/experience";
import type { Answers, AnswerValue, Question, QuestionId } from "@/features/experience/types/question";
import { QuestionRenderer } from "@/features/experience/components/question-renderer";

interface ExperienceSceneProps {
  scene: ExperienceSceneConfig;
  questions: readonly Question[];
  answers: Answers;
  onAnswerChange: (id: QuestionId, value: AnswerValue) => void;
}

export function ExperienceScene({ scene, questions, answers, onAnswerChange }: ExperienceSceneProps) {
  return (
    <section aria-labelledby="scene-title" className="space-y-4">
      <h1 id="scene-title" className="text-2xl font-semibold">
        {scene.title}
      </h1>
      {scene.description && <p>{scene.description}</p>}
      <div className="flex min-h-48 items-center justify-center rounded border border-dashed p-6 text-center sm:min-h-64">
        <p>{scene.visualPlaceholder}</p>
      </div>
      <div className="space-y-8">
        {questions.map((question) => (
          <QuestionRenderer key={question.id} question={question} value={answers[question.id]}
            onChange={(value) => onAnswerChange(question.id, value)} />
        ))}
      </div>
    </section>
  );
}
