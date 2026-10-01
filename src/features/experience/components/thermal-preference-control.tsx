import type { AnswerValue, Question } from "../types/question";
import styles from "./thermal-preference.module.css";

interface ThermalPreferenceProps {
  question: Extract<Question, { type: "multi-choice" }>;
  value: AnswerValue | undefined;
  order: readonly string[];
  position: number;
  onChange: (value: string[], position: number) => void;
}

export function ThermalPreferenceControl({ question, value, order, position, onChange }: ThermalPreferenceProps) {
  const options = order.flatMap((value) => question.options.filter((option) => option.value === value));
  const selected = Array.isArray(value) ? options.find((option) => value.includes(option.value)) : undefined;
  const id = `thermal-${question.id}`;
  function select(position: number) {
    const index = Math.round((position + 1) / 2 * (options.length - 1));
    onChange([options[index].value], position);
  }
  return <div className={styles.control}>
    <label htmlFor={id}>{question.text}{question.required && <><span aria-hidden="true"> *</span><span className="sr-only"> (obligatorio)</span></>}</label>
    {question.description && <p className={styles.help}>{question.description}</p>}
    <input id={id} type="range" min={-1} max={1} step={0.01} value={position} className={styles.slider}
      aria-valuetext={selected?.label ?? "Sin respuesta"} aria-describedby={`${id}-selection`}
      onChange={(event) => select(Number(event.currentTarget.value))}
      onPointerUp={(event) => select(Number(event.currentTarget.value))}
      onKeyUp={(event) => {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown", "Enter", " "].includes(event.key)) select(Number(event.currentTarget.value));
      }} />
    <div aria-hidden="true" className={styles.marks}>
      <span>Fresco</span><span>Estable</span><span>C?lido</span>
    </div>
    <p id={`${id}-selection`} className={styles.help}>{selected?.label ?? "Sin respuesta. Mueve el control para elegir."}</p>
  </div>;
}
