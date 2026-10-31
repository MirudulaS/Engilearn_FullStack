import { Link } from 'react-router-dom';
import { CheckCircle2, CircleDot, Circle } from 'lucide-react';
import Badge from '../common/Badge';

const statusIcon = {
  solved: { Icon: CheckCircle2, color: 'var(--color-success)' },
  attempted: { Icon: CircleDot, color: 'var(--color-warning)' },
  unattempted: { Icon: Circle, color: 'var(--color-text-faint)' },
};

export default function ProblemCard({ problem }) {
  const { Icon, color } = statusIcon[problem.status] ?? statusIcon.unattempted;

  return (
    <Link to={`/problem/${problem.id}`} className="card card-interactive problem-card">
      <Icon size={18} color={color} className="problem-card-status" />
      <div className="problem-card-body">
        <h3>{problem.title}</h3>
        <p className="text-muted problem-card-desc">{problem.description}</p>
        <div className="problem-card-meta">
          <Badge variant="neutral">{problem.subject}</Badge>
          <Badge variant="neutral">{problem.topic}</Badge>
        </div>
      </div>
      <Badge difficulty={problem.difficulty}>{problem.difficulty}</Badge>
    </Link>
  );
}
