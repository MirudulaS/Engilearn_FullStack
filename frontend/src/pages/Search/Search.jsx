import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listDepartments, listModulesByCategory } from '../../services/departmentService';
import { listProblems } from '../../services/problemService';
import Badge from '../../components/common/Badge';
import { EmptyState, LoadingState, ErrorState } from '../../components/common/States';
import './Search.css';

function matches(text, q) {
  return (text ?? '').toLowerCase().includes(q);
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const q = (searchParams.get('q') ?? '').trim().toLowerCase();

  const [departments, setDepartments] = useState([]);
  const [moduleResults, setModuleResults] = useState([]);
  const [problemResults, setProblemResults] = useState([]);
  const [status, setStatus] = useState(q ? 'loading' : 'idle');

  function load() {
    if (!q) {
      setStatus('idle');
      return;
    }
    setStatus('loading');

    listDepartments()
      .then(async (depts) => {
        setDepartments(depts);

        // No single "search all modules" endpoint exists, so pull every
        // populated category's modules and filter client-side — the same
        // approach MyLearning.jsx uses.
        const categoryFetches = [];
        depts.forEach((d) => {
          d.categories
            .filter((c) => c.moduleCount > 0)
            .forEach((c) => {
              categoryFetches.push(
                listModulesByCategory(d.id, c.id).then(({ modules }) =>
                  modules.map((m) => ({ ...m, departmentId: d.id, categoryId: c.id }))
                )
              );
            });
        });

        const [moduleGroups, problems] = await Promise.all([
          Promise.all(categoryFetches),
          listProblems({ query: q }),
        ]);

        setModuleResults(moduleGroups.flat().filter((m) => matches(m.title, q) || matches(m.subject, q)));
        setProblemResults(problems);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(load, [q]);

  const departmentResults = q
    ? departments.filter((d) => matches(d.name, q) || matches(d.description, q))
    : [];

  const categoryResults = q
    ? departments.flatMap((d) =>
        d.categories
          .filter((c) => matches(c.name, q) || matches(c.description, q))
          .map((c) => ({ ...c, departmentId: d.id, departmentName: d.shortName }))
      )
    : [];

  const totalResults =
    departmentResults.length + categoryResults.length + moduleResults.length + problemResults.length;

  function handleSubmit(e) {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Search</h1>
        <form onSubmit={handleSubmit} className="search-page-form">
          <input
            type="search"
            className="input"
            placeholder="Search departments, modules, problems…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
            autoFocus
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </header>

      {!q && (
        <EmptyState title="Start typing to search" description="Search across departments, learning categories, modules, and practice problems." />
      )}

      {q && status === 'loading' && <LoadingState message="Searching…" />}
      {q && status === 'error' && <ErrorState onAction={load} />}

      {q && status === 'ready' && totalResults === 0 && (
        <EmptyState title={`No results for "${searchParams.get('q')}"`} description="Try a different term, or check the spelling." />
      )}

      {q && status === 'ready' && totalResults > 0 && (
        <div className="search-results">
          {departmentResults.length > 0 && (
            <section className="search-section">
              <h2>Departments</h2>
              <div className="search-result-list">
                {departmentResults.map((d) => (
                  <Link to={`/departments/${d.id}`} className="card card-interactive search-result-item" key={d.id}>
                    <span>{d.name}</span>
                    <Badge variant="neutral">{d.shortName}</Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {categoryResults.length > 0 && (
            <section className="search-section">
              <h2>Learning categories</h2>
              <div className="search-result-list">
                {categoryResults.map((c) => (
                  <Link
                    to={`/departments/${c.departmentId}/${c.id}`}
                    className="card card-interactive search-result-item"
                    key={`${c.departmentId}-${c.id}`}
                  >
                    <span>{c.name}</span>
                    <Badge variant="neutral">{c.departmentName}</Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {moduleResults.length > 0 && (
            <section className="search-section">
              <h2>Modules</h2>
              <div className="search-result-list">
                {moduleResults.map((m) => (
                  <Link
                    to={`/departments/${m.departmentId}/${m.categoryId}/${m.id}`}
                    className="card card-interactive search-result-item"
                    key={m.id}
                  >
                    <span>{m.title}</span>
                    <Badge difficulty={m.difficulty}>{m.difficulty}</Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {problemResults.length > 0 && (
            <section className="search-section">
              <h2>Practice problems</h2>
              <div className="search-result-list">
                {problemResults.map((p) => (
                  <Link to={`/problem/${p.id}`} className="card card-interactive search-result-item" key={p.id}>
                    <span>{p.title}</span>
                    <Badge difficulty={p.difficulty}>{p.difficulty}</Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
