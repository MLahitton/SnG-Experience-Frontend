import { useId } from "react";
import type { DesignAestheticMode } from "../config/design-effects";
import styles from "./design-aesthetic.module.css";

// Image coordinates: the SVG and the photograph share a centered cover crop.
export function DesignAestheticOverlay({ mode }: { mode: DesignAestheticMode }) {
  const id = useId();
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice" className={styles.overlay}>
    {mode === "transparency" && <>
      <defs>
        <clipPath id={`${id}-glass`}><path d="M135 112 L451 228 L451 603 L135 683 Z M472 236 L503 247 L503 590 L472 599 Z M525 254 L575 271 L575 572 L525 586 Z" /></clipPath>
        <linearGradient id={`${id}-light`}><stop stopColor="white" stopOpacity="0" /><stop offset=".5" stopColor="white" stopOpacity=".3" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient>
      </defs>
      <g clipPath={`url(#${id}-glass)`}>
        <path d="M135 112 L575 271 L575 572 L135 683 Z" className={styles.glass} />
        <rect x="120" y="100" width="210" height="600" fill={`url(#${id}-light)`} className={styles.sweep} />
      </g>
      <path d="M138 116 L448 230 L448 600 L138 679 Z" pathLength={1} className={`${styles.line} ${styles.transparency}`} />
    </>}
    {mode === "integration" && <g className={styles.integration}>
      <path d="M135 105 L576 265 M135 691 L576 580 M619 587 L710 565 M1068 245 L1250 235 M1070 545 L1250 555 M1070 245 L1070 545" pathLength={1} className={styles.line} />
      <circle cx="1070" cy="245" r="3" fill="currentColor" />
      <circle cx="1070" cy="545" r="3" fill="currentColor" />
    </g>}
    {mode === "prominence" && <g className={styles.prominence}>
      <path d="M129 0 L129 689 M454 166 L454 604 M513 186 L513 588 M608 0 L608 583 M133 689 L577 581 M1177 246 L1177 536 M1069 244 L1250 234" pathLength={1} className={styles.line} />
      <path d="M695 518 L711 519 L711 598 M739 513 L756 512 L756 591 M829 486 L847 487 L847 575" pathLength={1} className={styles.line} />
    </g>}
  </svg>;
}
