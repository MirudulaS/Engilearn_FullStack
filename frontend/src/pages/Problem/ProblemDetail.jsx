import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Code2, Lightbulb, Home } from 'lucide-react';
import { getProblem, listProblems } from '../../services/problemService';
import { getDepartment } from '../../services/departmentService';
import Badge from '../../components/common/Badge';
import { EmptyState, LoadingState, ErrorState } from '../../components/common/States';
import ProblemNavPanel from '../../components/practice/ProblemNavPanel';
import './ProblemDetail.css';

function HintList({ hints }) {
  const [revealed, setRevealed] = useState(0);

  if (!hints || hints.length === 0) return null;

  return (
    <div className="hint-list">
      {hints.slice(0, revealed).map((hint, i) => (
        <div className="alert alert-info" key={i}>
          <Lightbulb size={16} />
          <span>{hint}</span>
        </div>
      ))}
      {revealed < hints.length && (
        <button className="btn btn-secondary btn-sm" onClick={() => setRevealed((r) => r + 1)}>
          Show hint {revealed + 1} of {hints.length}
        </button>
      )}
    </div>
  );
}

export default function ProblemDetail() {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [department, setDepartment] = useState(null);
  const [sameCategory, setSameCategory] = useState([]);
  const [relatedProblems, setRelatedProblems] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error | not-found

  function load() {
    setStatus('loading');
    getProblem(problemId)
      .then(async (p) => {
        const [dept, siblings, related] = await Promise.all([
          getDepartment(p.departmentId),
          listProblems({ categoryId: p.categoryId }),
          Promise.all((p.relatedProblemIds ?? []).map((id) => getProblem(id).catch(() => null))),
        ]);
        setProblem(p);
        setDepartment(dept);
        setSameCategory(siblings);
        setRelatedProblems(related.filter(Boolean));
        setStatus('ready');
      })
      .catch((err) => setStatus(err.message?.includes('No problem') ? 'not-found' : 'error'));
  }

  useEffect(load, [problemId]);

  if (status === 'loading') {
    return (
      <div className="page-container">
        <LoadingState message="Loading problem…" />
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

  if (status === 'not-found' || !problem) {
    return (
      <div className="page-container">
        <EmptyState title="Problem not found" description="That problem doesn't exist." />
      </div>
    );
  }

  const index = sameCategory.findIndex((p) => p.id === problem.id);
  const prevProblem = sameCategory[index - 1];
  const nextProblem = sameCategory[index + 1];

  return (
    <div className="page-container problem-detail">
      <nav className="breadcrumbs">
        <Link to="/" className="breadcrumb-home"><Home size={13} /> Home</Link>
        <ChevronRight size={14} />
        <Link to="/departments">Departments</Link>
        <ChevronRight size={14} />
        <Link to={`/departments/${problem.departmentId}`}>{department?.shortName}</Link>
        <ChevronRight size={14} />
        <Link to="/practice">Practice</Link>
        <ChevronRight size={14} />
        <span>{problem.title}</span>
      </nav>

      <header className="problem-detail-header">
        <div>
          <h1>{problem.title}</h1>
          <div className="problem-detail-badges">
            <Badge difficulty={problem.difficulty}>{problem.difficulty}</Badge>
            <Badge variant="neutral">{department?.shortName}</Badge>
            <Badge variant="neutral">{problem.subject}</Badge>
            <Badge variant="neutral">{problem.topic}</Badge>
          </div>
        </div>
        <Link to={`/compiler?problem=${problem.id}`} className="btn btn-primary">
          <Code2 size={16} />
          Open in Compiler
        </Link>
      </header>

      <section className="problem-section">
        <h2>Problem statement</h2>
        <p>{problem.statement ?? problem.description}</p>
      </section>

      <div className="problem-io-grid">
        <section className="problem-section">
          <h2>Input format</h2>
          <p>{problem.inputFormat}</p>
        </section>
        <section className="problem-section">
          <h2>Output format</h2>
          <p>{problem.outputFormat}</p>
        </section>
      </div>

      {problem.constraints?.length > 0 && (
        <section className="problem-section">
          <h2>Constraints</h2>
          <ul className="constraint-list">
            {problem.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      {problem.examples?.length > 0 && (
        <section className="problem-section">
          <h2>Examples</h2>
          <div className="example-list">
            {problem.examples.map((ex, i) => (
              <div className="example-block" key={i}>
                <div>
                  <span className="text-muted example-label">Input</span>
                  <pre className="module-code-block">{ex.input}</pre>
                </div>
                <div>
                  <span className="text-muted example-label">Output</span>
                  <pre className="module-code-block">{ex.output}</pre>
                </div>
                {ex.explanation && <p className="text-muted example-explanation">{ex.explanation}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {problem.hints?.length > 0 && (
        <section className="problem-section">
          <h2>Hints</h2>
          <HintList hints={problem.hints} />
        </section>
      )}

      {relatedProblems.length > 0 && (
        <section className="problem-section">
          <h2>Related problems</h2>
          <div className="related-list">
            {relatedProblems.map((rp) => (
              <Link to={`/problem/${rp.id}`} className="related-item" key={rp.id}>
                <span>{rp.title}</span>
                <Badge difficulty={rp.difficulty}>{rp.difficulty}</Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ProblemNavPanel prevProblem={prevProblem} nextProblem={nextProblem} />
    </div>
  );
}
