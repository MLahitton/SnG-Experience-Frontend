import type { SecurityVisualMode } from "../config/security-effects";
import styles from "./security-scene-overlay.module.css";

// Coordinates traced against the photograph, normalized to a 1672 x 941 view.
const outlines: Record<SecurityVisualMode, readonly string[]> = {
  envelope: [
    "M230 40 L556 81 L556 614 L230 640 Z",
    "M584 84 L933 128 L933 587 L584 612 Z",
    "M961 132 L971 133 L971 578 L961 581 Z",
  ],
  access: ["M579 76 L929 119 L929 584 L579 615 Z"],
  threshold: ["M577 619 L930 587", "M583 630 L934 598", "M581 615 L581 530"],
};

export function SecuritySceneOverlay({ mode }: { mode: SecurityVisualMode }) {
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice" className={styles.overlay}>
    {mode === "envelope" && <g className={styles.profiles}>
      {/* Image-space strokes grow with the same crop/scale as the photograph.
          Only exposed frame sections are traced to avoid painting over furniture. */}
      <path d="M215 24 L964 118" className={styles.frame} />
      <path d="M570 68 L570 619" className={styles.frame} />
      <path d="M947 116 L947 350" className={styles.frame} />
      <path d="M216 27 L216 240" className={styles.frame} />
      <path d="M453 628 L736 608" className={styles.rail} />
    </g>}
    <g key={mode} className={`${styles.tracing} ${mode === "threshold" ? styles.occupant : ""}`}>
      {mode === "threshold" && <path d="M583 619 L790 600 L741 656 L590 671 Z" className={styles.crossing} />}
      {outlines[mode].map((path) => <path key={path} d={path} pathLength={1} className={styles.line} vectorEffect="non-scaling-stroke" />)}
      {mode === "access" && <circle cx="582" cy="370" r="4" className={styles.marker} />}
    </g>
  </svg>;
}
