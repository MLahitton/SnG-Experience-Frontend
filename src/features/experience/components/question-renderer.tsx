import type { AnswerValue, Question } from "@/features/experience/types/question";

interface QuestionRendererProps {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
}

const inputClassName = "w-full rounded border bg-background p-3 focus-visible:outline-2 focus-visible:outline-offset-2";

export function QuestionRenderer({ question, value, onChange }: QuestionRendererProps) {
  const id = `question-${question.id}`;
  const descriptionId = question.description ? `${id}-description` : undefined;
  const label = <>{question.text}{question.required && <span aria-hidden="true"> *</span>}</>;
  const description = question.description && <p id={descriptionId} className="text-sm">{question.description}</p>;

  if (question.type === "text" || question.type === "tel" || question.type === "textarea") {
    const props = {
      id, name: question.id, required: question.required,
      placeholder: question.placeholder,
      value: typeof value === "string" ? value : "",
      "aria-describedby": descriptionId,
      className: inputClassName,
    };
    return (
      <div className="space-y-2">
        <label htmlFor={id} className="block font-medium">{label}</label>
        {description}
        {question.type === "textarea" ? (
          <textarea {...props} rows={3} onChange={(event) => onChange(event.target.value)} />
        ) : (
          <input {...props} type={question.type} onChange={(event) => onChange(event.target.value)} />
        )}
      </div>
    );
  }

  if (question.type === "scale") {
    return (
      <fieldset aria-describedby={`${id}-scale`} className="min-w-0 space-y-2">
        <legend className="font-medium">{label}</legend>
        <p id={`${id}-scale`} className="text-sm">{question.min} = {question.minLabel} · {question.max} = {question.maxLabel}</p>
        <div className="flex flex-wrap gap-5">
          {Array.from({ length: question.max - question.min + 1 }, (_, index) => question.min + index).map((number) => (
            <label key={number} className="flex items-center gap-2 py-2">
              <input type="radio" name={question.id} value={number} checked={value === number}
                required={question.required} onChange={() => onChange(number)} />
              {number}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (question.type === "single-choice" || question.type === "multi-choice") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <fieldset aria-describedby={descriptionId} className="min-w-0 space-y-2">
        <legend className="font-medium">{label}</legend>
        {description}
        {question.options.map((option) => {
          const checked = question.type === "multi-choice" ? selected.includes(option.value) : value === option.value;
          const atLimit = question.type === "multi-choice" && selected.length >= (question.maxSelections ?? Infinity);
          return (
            <label key={option.value} className="flex items-start gap-3 py-2">
              <input
                type={question.type === "multi-choice" ? "checkbox" : "radio"}
                name={question.id} value={option.value} checked={checked}
                required={question.type === "single-choice" && question.required}
                disabled={!checked && atLimit} className="mt-1 shrink-0"
                onChange={() => {
                  if (question.type === "single-choice") {
                    onChange(option.value);
                  } else if (checked) {
                    onChange(selected.filter((item) => item !== option.value));
                  } else if (!atLimit) {
                    onChange(option.exclusive ? [option.value] : [
                      ...selected.filter((item) => !question.options.some((candidate) => candidate.value === item && candidate.exclusive)),
                      option.value,
                    ]);
                  }
                }}
              />
              <span>{option.label}{option.description && <span className="block text-sm">{option.description}</span>}</span>
            </label>
          );
        })}
      </fieldset>
    );
  }
}
