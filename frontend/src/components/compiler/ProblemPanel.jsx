import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { EmptyState } from '../common/States';

export default function ProblemPanel({ problem }) {
  if (!problem) {
    return (
      <div className="problem-panel">
        <EmptyState
          title="No problem selected"
          description="Open the compiler from a problem's page to see its statement here, or just experiment freely."
          action="Browse problems"
          onAction={() => {
            window.location.href = '/practice';
          }}
        />
      </div>
    );
  }

  return (
    <div className="problem-panel">
      <Link to={`/problem/${problem.id}`} className="problem-panel-title-link">
        <h2>{problem.title}</h2>
      </Link>
      <div className="problem-detail-badges">
        <Badge difficulty={problem.difficulty}>{problem.difficulty}</Badge>
        <Badge variant="neutral">{problem.subject}</Badge>
        <Badge variant="neutral">{problem.topic}</Badge>
      </div>

      <section className="problem-panel-section">
        <h3>Statement</h3>
        <p>{problem.statement ?? problem.description}</p>
      </section>

      {problem.constraints?.length > 0 && (
        <section className="problem-panel-section">
          <h3>Constraints</h3>
          <ul className="constraint-list">
            {problem.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      {problem.examples?.length > 0 && (
        <section className="problem-panel-section">
          <h3>Examples</h3>
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
            </div>
          ))}
        </section>
      )}

      {problem.hints?.length > 0 && (
        <section className="problem-panel-section">
          <h3>Hints</h3>
          <ul className="constraint-list">
            {problem.hints.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
