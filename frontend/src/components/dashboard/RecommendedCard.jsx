import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getDepartmentById } from '../../data/departments';
import { EmptyState } from '../common/States';

export default function RecommendedCard({ items = [] }) {
  if (items.length === 0) {
    return <EmptyState title="No recommendations yet" description="Complete a few modules and we'll suggest what's next." />;
  }

  return (
    <ul className="recommend-list">
      {items.map((item) => {
        const department = getDepartmentById(item.departmentId);
        return (
          <li key={item.id}>
            <Link
              to={`/departments/${item.departmentId}/${item.categoryId}`}
              className="recommend-item"
            >
              <div>
                <span className="recommend-item-dept" style={{ color: `var(${department?.accentVar})` }}>
                  {department?.code}
                </span>
                <span className="recommend-item-title">{item.title}</span>
                <span className="text-muted recommend-item-reason">{item.reason}</span>
              </div>
              <ArrowUpRight size={16} color="var(--color-text-faint)" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
