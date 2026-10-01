import { DockScale } from "@/features/experience/components/dock-scale";
import { DockChoice } from "@/features/experience/components/dock-choice";
import type { AnswerValue, Question } from "@/features/experience/types/question";

interface QuestionRendererProps {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  variant?: "immersive";
  layout?: "dock";
  refinedScale?: boolean;
}

const inputClassName = "min-h-11 w-full min-w-0 rounded-sm border border-stone-400 bg-white/80 px-3 py-2.5 text-base text-stone-900 placeholder:text-stone-500 focus-visible:border-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700";

export function QuestionRenderer({ question, value, onChange, variant, layout, refinedScale }: QuestionRendererProps) {
  const immersive = variant === "immersive";
  const id = `question-${question.id}`;
  const descriptionId = question.description ? `${id}-description` : undefined;
  const label = <>{question.text}{question.required && <span aria-hidden="true"> *</span>}</>;
  const description = question.description && <p id={descriptionId} className={immersive ? "max-w-sm text-[11px] leading-snug text-stone-300/85" : "text-xs leading-relaxed text-stone-600"}>{question.description}</p>;

  // Up to four choices stay inline; larger single-choice lists open above the dock.
  if (layout === "dock" && question.type === "single-choice" && question.options.length > 4) {
    return <div className="space-y-1.5">
      <p id={`${id}-label`} className="text-sm font-medium">{label}</p>
      {description}
      <DockChoice id={id} labelId={`${id}-label`} descriptionId={descriptionId} required={question.required}
        options={question.options} value={typeof value === "string" ? value : undefined} onChange={onChange} />
    </div>;
  }

  if (question.type === "text" || question.type === "tel" || question.type === "textarea") {
    const props = {
      id, name: question.id, required: question.required,
      placeholder: question.placeholder,
      value: typeof value === "string" ? value : "",
      "aria-describedby": descriptionId,
      className: immersive ? "min-h-9 w-full min-w-0 rounded-sm border border-white/12 bg-white/[0.04] px-3 py-1 text-base text-stone-100 placeholder:text-stone-400 hover:border-white/30 focus-visible:border-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200" : inputClassName,
    };
    return (
      <div className={immersive ? "max-w-md space-y-1.5" : "space-y-2"}>
        <label htmlFor={id} className="block text-sm font-medium leading-relaxed">{label}</label>
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
    if (layout === "dock") {
      return <DockScale refinedScale={refinedScale} question={question} value={value} onChange={onChange} />;
    }
    return (
      <fieldset aria-describedby={`${id}-scale`} className="min-w-0 space-y-2">
        <legend className="text-sm font-medium leading-relaxed">{label}</legend>
        <p id={`${id}-scale`} className="text-xs leading-relaxed text-stone-600">{question.min} = {question.minLabel} · {question.max} = {question.maxLabel}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {Array.from({ length: question.max - question.min + 1 }, (_, index) => question.min + index).map((number) => (
            <label key={number} className="flex min-h-11 items-center gap-2 py-2 text-sm">
              <input className="size-4 accent-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2" type="radio" name={question.id} value={number} checked={value === number}
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
    const optionControls = question.options.map((option) => {
          const checked = question.type === "multi-choice" ? selected.includes(option.value) : value === option.value;
          const atLimit = question.type === "multi-choice" && selected.length >= (question.maxSelections ?? Infinity);
          return (
            <label key={option.value} className={immersive ? "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-sm border border-transparent px-1.5 py-1 text-sm leading-snug hover:bg-white/5 has-[:checked]:border-white/15 has-[:checked]:bg-white/10 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-stone-100" : "flex min-h-11 items-start gap-3 py-2 text-sm leading-relaxed"}>
              <input
                type={question.type === "multi-choice" ? "checkbox" : "radio"}
                name={question.id} value={option.value} checked={checked}
                required={question.type === "single-choice" && question.required}
                disabled={!checked && atLimit} className={immersive ? "peer sr-only" : "mt-1 size-4 shrink-0 accent-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40"}
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
              <span className={immersive ? "min-w-0 flex-1" : "min-w-0"}>{option.label}{option.description && <span className={immersive ? "mt-0.5 block text-[11px] leading-snug text-stone-300" : "mt-0.5 block text-xs leading-relaxed text-stone-600"}>{option.description}</span>}</span>
              {immersive && <span aria-hidden="true" className="order-first size-3 shrink-0 rounded-full border border-white/50 peer-checked:border-stone-100 peer-checked:bg-stone-100 peer-checked:shadow-[inset_0_0_0_3px_#343b37]" /> }
            </label>
          );
        });

    return (
      <fieldset aria-describedby={descriptionId} className={layout === "dock" ? "min-h-0 min-w-0 space-y-2" : "min-w-0 space-y-2"}>
        <legend className="text-sm font-medium leading-relaxed">{label}</legend>
        {description}
        {layout === "dock" ? (
          <div className="flex flex-wrap gap-2">
            {optionControls}
          </div>
        ) : optionControls}
      </fieldset>
    );
  }
}
