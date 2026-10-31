import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listDepartments, listModulesByCategory } from '../../services/departmentService';
import { getCompletedModuleIds } from '../../services/progressService';
import { getMyRecommendations } from '../../services/recommendationService';
import ContinueLearningCard from '../../components/dashboard/ContinueLearningCard';
import ModuleCard from '../../components/learning/ModuleCard';
import { EmptyState, LoadingState, ErrorState } from '../../components/common/States';
import '../Learning/CategoryModules.css';
import './MyLearning.css';

// Every piece of data on this page is now real — module lists, completion
// status, and "continue learning" (via the same recommendation logic the
// Dashboard uses).
export default function MyLearning() {
  const [groups, setGroups] = useState([]);
  const [continueLearning, setContinueLearning] = useState(null);
  const [status, setStatus] = useState('loading');

  function load() {
    setStatus('loading');
    Promise.all([listDepartments(), getMyRecommendations().catch(() => ({ continueLearning: null }))])
      .then(async ([departments, recData]) => {
        setContinueLearning(recData.continueLearning);
        const completedIds = await getCompletedModuleIds().catch(() => []);
        const completedSet = new Set(completedIds);

        const categoryFetches = [];
        departments.forEach((dept) => {
          dept.categories
            .filter((c) => c.moduleCount > 0)
            .forEach((cat) => {
              categoryFetches.push(
                listModulesByCategory(dept.id, cat.id).then(({ modules }) => ({
                  departmentId: dept.id,
                  categoryId: cat.id,
                  categoryName: cat.name,
                  modules: modules.map((m) => ({ ...m, completed: completedSet.has(m.id) })),
                }))
              );
            });
        });

        const results = await Promise.all(categoryFetches);
        setGroups(results.filter((g) => g.modules.length > 0));
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(load, []);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>My Learning</h1>
        <p className="text-muted">Everything you've started, grouped by learning path.</p>
      </header>

      {continueLearning && (
        <section className="dash-section">
          <ContinueLearningCard continueLearning={continueLearning} />
        </section>
      )}

      {status === 'loading' && <LoadingState message="Loading your learning paths…" />}
      {status === 'error' && <ErrorState onAction={load} />}

      {status === 'ready' && groups.length === 0 && (
        <EmptyState
          title="Nothing started yet"
          description="Open a department and start your first module to see it here."
          action="Browse departments"
          onAction={() => {
            window.location.href = '/departments';
          }}
        />
      )}

      {status === 'ready' &&
        groups.map((group) => {
          const completedCount = group.modules.filter((m) => m.completed).length;
          return (
            <section className="my-learning-group" key={`${group.departmentId}::${group.categoryId}`}>
              <div className="my-learning-group-head">
                <h2>
                  <Link to={`/departments/${group.departmentId}/${group.categoryId}`}>{group.categoryName}</Link>
                </h2>
                <span className="text-muted">
                  {completedCount} of {group.modules.length} completed
                </span>
              </div>
              <div className="module-grid">
                {group.modules.map((module) => (
                  <ModuleCard
                    departmentId={group.departmentId}
                    categoryId={group.categoryId}
                    module={module}
                    key={module.id}
                  />
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
}
