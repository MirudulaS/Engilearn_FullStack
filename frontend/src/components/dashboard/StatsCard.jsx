export default function StatsCard({ icon: Icon, label, value, suffix = '' }) {
  return (
    <div className="card stats-card">
      <div className="stats-card-icon">
        <Icon size={18} color="var(--color-accent)" />
      </div>
      <div>
        <div className="stats-card-value">
          {value}
          {suffix}
        </div>
        <div className="text-muted stats-card-label">{label}</div>
      </div>
    </div>
  );
}
