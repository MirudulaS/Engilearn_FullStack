export default function ProgressBar({ value = 0, label, tone = 'default', showValue = true }) {
  const clamped = Math.max(0, Math.min(100, value));
  const toneClass = tone === 'success' ? 'is-success' : tone === 'warning' ? 'is-warning' : '';

  return (
    <div>
      {(label || showValue) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-2)',
            fontSize: 'var(--text-sm)',
          }}
        >
          {label && <span className="text-muted">{label}</span>}
          {showValue && <span style={{ fontWeight: 'var(--weight-medium)' }}>{clamped}%</span>}
        </div>
      )}
      <div className="progress" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div className={`progress-fill ${toneClass}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
