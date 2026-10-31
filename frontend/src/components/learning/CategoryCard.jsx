import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryCard({ departmentId, category }) {
  return (
    <Link
      to={`/departments/${departmentId}/${category.id}`}
      className="card card-interactive category-card"
    >
      <h3>{category.name}</h3>
      <p className="text-muted category-card-desc">{category.description}</p>
      <div className="category-card-meta">
        <span>{category.moduleCount} modules</span>
        <span>{category.problemCount} problems</span>
      </div>
      <span className="dept-card-explore">
        View path <ArrowUpRight size={14} />
      </span>
    </Link>
  );
}
