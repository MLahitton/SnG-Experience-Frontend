import { useEffect, useRef, useState } from "react";
import type { QuestionOption } from "@/features/experience/types/question";

interface DockChoiceProps {
  id: string;
  labelId: string;
  descriptionId?: string;
  required: boolean;
  options: readonly QuestionOption[];
  value: string | undefined;
  onChange: (value: string) => void;
}

export function DockChoice({ id, labelId, descriptionId, required, options, value, onChange }: DockChoiceProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const selected = options.find((option) => option.value === value);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  function show() {
    setActive(Math.max(0, options.findIndex((option) => option.value === value)));
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  useEffect(() => {
    if (open) optionRefs.current[active]?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  return (
    <div ref={root} className="relative w-full max-w-sm" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button ref={trigger} id={id} type="button" aria-haspopup="listbox" aria-expanded={open}
        aria-controls={`${id}-list`} aria-labelledby={`${labelId} ${id}-value`} aria-describedby={descriptionId}
        className="flex min-h-10 w-full items-center justify-between gap-3 rounded-sm border border-white/20 bg-white/[0.04] px-3 py-1.5 text-left text-sm hover:border-white/35 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200"
        onClick={() => open ? close() : show()}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); show(); }
        }}>
        <span id={`${id}-value`}>{selected?.label ?? "Selecciona una opción"}</span><span aria-hidden="true" className="shrink-0 text-xs text-stone-300">▾</span>
      </button>
      {open && <div ref={list} id={`${id}-list`} role="listbox" tabIndex={-1}
        aria-labelledby={labelId} aria-required={required} aria-activedescendant={`${id}-option-${active}`}
        className="absolute inset-x-0 bottom-full z-30 mb-2 max-h-[min(40dvh,20rem)] overflow-y-auto overscroll-contain rounded-md border border-white/20 bg-[#202321] p-1 shadow-xl focus:outline-none"
        onKeyDown={(event) => {
          if (event.key === "Escape") { event.preventDefault(); close(); }
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            setActive((index) => event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 :
              (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault(); onChange(options[active].value); close();
          }
          if (event.key === "Tab") { event.preventDefault(); close(); }
        }}>
        {options.map((option, index) => <div key={option.value} id={`${id}-option-${index}`}
          ref={(element) => { optionRefs.current[index] = element; }} role="option" aria-selected={option.value === value}
          className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-sm px-3 py-2 text-sm ${active === index ? "bg-white/15 outline outline-white/30" : "hover:bg-white/10"}`}
          onPointerMove={() => setActive(index)} onClick={() => { onChange(option.value); close(); }}>
          <span>{option.label}{option.description && <span className="block text-xs text-stone-300">{option.description}</span>}</span>
          {option.value === value && <span aria-hidden="true">✓</span>}
        </div>)}
      </div>}
    </div>
  );
}
