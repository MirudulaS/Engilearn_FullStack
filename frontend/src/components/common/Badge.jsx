/**
 * variant: neutral | accent | success | warning | danger | info
 * or pass difficulty="easy|medium|hard" for a semantic difficulty badge,
 * or pass color + bg (CSS color values, e.g. "var(--color-dept-ece)") for a
 * one-off custom tint — used for department-colored tags.
 */
export default function Badge({ children, variant = 'neutral', difficulty, color, bg, className = '' }) {
  const cls = difficulty ? `badge-difficulty-${difficulty}` : `badge-${variant}`;
  const style = color || bg ? { color, background: bg } : undefined;
  return (
    <span className={`badge ${cls} ${className}`.trim()} style={style}>
      {children}
    </span>
  );
}
