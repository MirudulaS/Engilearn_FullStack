import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Badge from '../common/Badge';

export default function DepartmentCard({ department, skillLimit = 3 }) {
  const accent = `var(${department.accentVar})`;
  const accentSoft = `var(${department.accentVar}-soft)`;

  return (
    <Link
      to={`/departments/${department.id}`}
      className="card card-interactive dept-card"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <div className="dept-card-code" style={{ color: accent }}>
        {department.code}
      </div>
      <h3>{department.name}</h3>
      <p className="text-muted dept-card-desc">{department.description}</p>
      <div className="dept-card-meta">
        <span>{department.moduleCount} modules</span>
        <span>{department.problemCount} problems</span>
      </div>
      <div className="dept-card-skills">
        {department.skillCategories.slice(0, skillLimit).map((skill) => (
          <Badge key={skill} color={accent} bg={accentSoft}>
            {skill}
          </Badge>
        ))}
      </div>
      <span className="dept-card-explore" style={{ color: accent }}>
        Explore <ArrowUpRight size={14} />
      </span>
    </Link>
  );
}
