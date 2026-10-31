import { Link } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import Badge from '../common/Badge';

export default function ModuleCard({ departmentId, categoryId, module }) {
  return (
    <Link
      to={`/departments/${departmentId}/${categoryId}/${module.id}`}
      className="card card-interactive module-card"
    >
      <div className="module-card-head">
        {module.completed ? (
          <CheckCircle2 size={18} color="var(--color-success)" />
        ) : (
          <Circle size={18} color="var(--color-text-faint)" />
        )}
        <span className="text-muted module-card-subject">{module.subject}</span>
      </div>
      <h3>{module.title}</h3>
      <p className="text-muted module-card-desc">{module.description}</p>
      <Badge difficulty={module.difficulty}>{module.difficulty}</Badge>
    </Link>
  );
}
