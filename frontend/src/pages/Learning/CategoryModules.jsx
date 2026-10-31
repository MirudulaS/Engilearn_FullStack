import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getDepartment, listModulesByCategory } from '../../services/departmentService';
import { getCompletedModuleIds } from '../../services/progressService';
import ModuleCard from '../../components/learning/ModuleCard';
import { EmptyState, LoadingState, ErrorState } from '../../components/common/States';
import '../Departments/DepartmentDetail.css';
import './CategoryModules.css';

export default function CategoryModules() {
  const { departmentId, categoryId } = useParams();
  const [department, setDepartment] = useState(null);
  const [category, setCategory] = useState(null);
  const [categoryModules, setCategoryModules] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error | not-found

  function load() {
    setStatus('loading');
    Promise.all([
      getDepartment(departmentId),
      listModulesByCategory(departmentId, categoryId),
      getCompletedModuleIds().catch(() => []), // don't block the page on this failing
    ])
      .then(([dept, { category: cat, modules }, completedIds]) => {
        const completedSet = new Set(completedIds);
        setDepartment(dept);
        setCategory(cat);
        setCategoryModules(modules.map((m) => ({ ...m, completed: completedSet.has(m.id) })));
        setStatus('ready');
      })
      .catch((err) => setStatus(err.message?.includes('No ') ? 'not-found' : 'error'));
  }

  useEffect(load, [departmentId, categoryId]);

  if (status === 'loading') {
    return (
      <div className="page-container">
        <LoadingState message="Loading learning path…" />
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

  if (status === 'not-found' || !department || !category) {
    return (
      <div className="page-container">
        <EmptyState title="Learning path not found" description="That department or category doesn't exist." />
      </div>
    );
  }

  const completedCount = categoryModules.filter((m) => m.completed).length;

  return (
    <div className="page-container">
      <nav className="breadcrumbs">
        <Link to="/" className="breadcrumb-home"><Home size={13} /> Home</Link>
        <ChevronRight size={14} />
        <Link to="/departments">Departments</Link>
        <ChevronRight size={14} />
        <Link to={`/departments/${departmentId}`}>{department.shortName}</Link>
        <ChevronRight size={14} />
        <span>{category.name}</span>
      </nav>

      <header className="page-header">
        <h1>{category.name}</h1>
        <p className="text-muted">{category.description}</p>
        {categoryModules.length > 0 && (
          <p className="text-muted category-progress-note">
            {completedCount} of {categoryModules.length} modules completed
          </p>
        )}
      </header>

      {categoryModules.length === 0 ? (
        <EmptyState
          title="Modules coming soon"
          description="This learning path doesn't have published modules yet — check back soon."
        />
      ) : (
        <div className="module-grid">
          {categoryModules.map((module) => (
            <ModuleCard
              departmentId={departmentId}
              categoryId={categoryId}
              module={module}
              key={module.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
