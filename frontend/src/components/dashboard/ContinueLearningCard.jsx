import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import { getDepartmentById } from '../../data/departments';

export default function ContinueLearningCard({ continueLearning }) {
  const department = getDepartmentById(continueLearning.departmentId);

  return (
    <div className="card continue-card">
      <div className="continue-card-info">
        <span className="text-muted continue-card-eyebrow">
          Continue in {department?.shortName}
        </span>
        <h3>{continueLearning.moduleTitle}</h3>
        <div className="continue-card-progress">
          <ProgressBar value={continueLearning.progressPercent} showValue={false} />
          <span className="text-muted">{continueLearning.progressPercent}% complete</span>
        </div>
      </div>
      <Link
        to={`/departments/${continueLearning.departmentId}/${continueLearning.categoryId}`}
        className="btn btn-primary"
      >
        <PlayCircle size={16} />
        Continue Learning
      </Link>
    </div>
  );
}
