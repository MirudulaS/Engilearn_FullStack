import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listProblems } from '../../services/problemService';
import { getProblemStatuses } from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';
import FilterBar from '../../components/practice/FilterBar';
import ProblemCard from '../../components/practice/ProblemCard';
import { EmptyState, LoadingState, ErrorState } from '../../components/common/States';
import './Practice.css';

const emptyFilters = { query: '', departmentId: '', difficulty: '', status: '' };

export default function Practice() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({
    ...emptyFilters,
    departmentId: searchParams.get('department') ?? '',
  });

  // Query-param scoping from a module's "Practice this topic" link narrows
  // results to that module without taking over the visible filter controls.
  const moduleId = searchParams.get('module');
  const categoryId = searchParams.get('category');

  const [problems, setProblems] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [status, setStatus] = useState('loading'); // loading | ready | error

  function load() {
    setStatus('loading');
    Promise.all([
      listProblems({ departmentId: filters.departmentId, difficulty: filters.difficulty, moduleId, categoryId, query: filters.query }),
      isAuthenticated ? getProblemStatuses().catch(() => ({})) : Promise.resolve({}),
    ])
      .then(([problemList, statusMap]) => {
        setProblems(problemList);
        setStatuses(statusMap);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }

  // Re-fetch whenever a server-side filter changes; the status filter is
  // applied client-side below since it depends on per-user data.
  useEffect(load, [filters.departmentId, filters.difficulty, filters.query, moduleId, categoryId, isAuthenticated]);

  const results = useMemo(() => {
    const withStatus = problems.map((p) => ({ ...p, status: statuses[p.id] ?? 'unattempted' }));
    if (!filters.status) return withStatus;
    return withStatus.filter((p) => p.status === filters.status);
  }, [problems, statuses, filters.status]);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Practice</h1>
        <p className="text-muted">
          {results.length} of {problems.length} problems
          {moduleId ? ' · scoped to this module' : ''}
        </p>
      </header>

      <FilterBar filters={filters} onChange={setFilters} />

      {status === 'loading' && <LoadingState message="Loading problems…" />}
      {status === 'error' && <ErrorState onAction={load} />}
      {status === 'ready' && results.length === 0 && (
        <EmptyState
          title="No problems match"
          description="Try clearing a filter or searching a different term."
          action="Clear filters"
          onAction={() => setFilters(emptyFilters)}
        />
      )}
      {status === 'ready' && results.length > 0 && (
        <div className="problem-list">
          {results.map((problem) => (
            <ProblemCard problem={problem} key={problem.id} />
          ))}
        </div>
      )}
    </div>
  );
}
