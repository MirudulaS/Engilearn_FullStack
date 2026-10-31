import { Link } from 'react-router-dom';
import { getDepartmentById } from '../../data/departments';
import ProgressBar from '../common/ProgressBar';

export default function DepartmentProgressList({ items = [] }) {
  return (
    <div className="dept-progress-list">
      {items.map((item) => {
        const department = getDepartmentById(item.departmentId);
        if (!department) return null;
        return (
          <Link to={`/departments/${item.departmentId}`} className="dept-progress-item" key={item.departmentId}>
            <div className="dept-progress-item-head">
              <span className="dept-card-code" style={{ color: `var(${department.accentVar})` }}>
                {department.code}
              </span>
              <span>{item.percent}%</span>
            </div>
            <ProgressBar value={item.percent} showValue={false} />
          </Link>
        );
      })}
    </div>
  );
}
