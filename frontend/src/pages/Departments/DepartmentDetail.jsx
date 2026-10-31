import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getDepartment } from '../../services/departmentService';
import CategoryCard from '../../components/learning/CategoryCard';
import Badge from '../../components/common/Badge';
import { EmptyState, LoadingState, ErrorState } from '../../components/common/States';
import './DepartmentDetail.css';

export default function DepartmentDetail() {
  const { departmentId } = useParams();
  const [department, setDepartment] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error | not-found

  function load() {
    setStatus('loading');
    getDepartment(departmentId)
      .then((data) => {
        setDepartment(data);
        setStatus('ready');
      })
      .catch((err) => setStatus(err.message?.includes('No department') ? 'not-found' : 'error'));
  }

  useEffect(load, [departmentId]);

  if (status === 'loading') {
    return (
      <div className="page-container">
        <LoadingState message="Loading department…" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="page-container">
        <ErrorState onAction={load} />
      </div>
    );
  }

  if (status === 'not-found' || !department) {
    return (
      <div className="page-container">
        <EmptyState
          title="Department not found"
          description="That department doesn't exist yet."
          action="Back to departments"
          onAction={() => {
            window.location.href = '/departments';
          }}
        />
      </div>
    );
  }

  const totalModules = department.categories.reduce((sum, c) => sum + c.moduleCount, 0);
  const totalProblems = department.categories.reduce((sum, c) => sum + c.problemCount, 0);

  return (
    <div className="page-container">
      <nav className="breadcrumbs">
        <Link to="/" className="breadcrumb-home"><Home size={13} /> Home</Link>
        <ChevronRight size={14} />
        <Link to="/departments">Departments</Link>
        <ChevronRight size={14} />
        <span>{department.shortName}</span>
      </nav>

      <header className="dept-detail-header">
        <div>
          <div className="dept-card-code" style={{ color: `var(${department.accentVar})` }}>
            {department.code}
          </div>
          <h1>{department.name}</h1>
          <p className="text-muted dept-detail-desc">{department.description}</p>
        </div>
        <div className="dept-detail-stats">
          <div>
            <span className="dept-detail-stat-value">{totalModules}</span>
            <span className="text-muted">modules</span>
          </div>
          <div>
            <span className="dept-detail-stat-value">{totalProblems}</span>
            <span className="text-muted">problems</span>
          </div>
        </div>
      </header>

      <div className="dept-detail-skills">
        {department.skillCategories.map((skill) => (
          <Badge key={skill} color={`var(${department.accentVar})`} bg={`var(${department.accentVar}-soft)`}>
            {skill}
          </Badge>
        ))}
      </div>

      <h2 className="section-title">Learning categories</h2>
      <div className="category-grid">
        {department.categories.map((category) => (
          <CategoryCard departmentId={department.id} category={category} key={category.id} />
        ))}
      </div>
    </div>
  );
}
