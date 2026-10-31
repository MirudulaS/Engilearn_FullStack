import { CheckCircle2, BookOpen, Award } from 'lucide-react';
import { EmptyState } from '../common/States';

const iconByType = {
  submission: CheckCircle2,
  module: BookOpen,
  achievement: Award,
};

export default function ActivityCard({ activity = [] }) {
  if (activity.length === 0) {
    return <EmptyState title="No activity yet" description="Solve a problem or finish a module to see it here." />;
  }

  return (
    <ul className="activity-list">
      {activity.map((item) => {
        const Icon = iconByType[item.type] ?? CheckCircle2;
        return (
          <li className="activity-item" key={item.id}>
            <span className="activity-item-icon">
              <Icon size={16} color="var(--color-accent)" />
            </span>
            <div className="activity-item-body">
              <span>{item.label}</span>
              <span className="text-muted activity-item-meta">{item.meta}</span>
            </div>
            <span className="text-faint activity-item-time">{item.timestamp}</span>
          </li>
        );
      })}
    </ul>
  );
}
