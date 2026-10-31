import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Bookmark, Flag } from 'lucide-react';

export default function ProblemNavPanel({ prevProblem, nextProblem }) {
  const [marked, setMarked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="problem-nav-panel">
      <div className="problem-nav-panel-arrows">
        {prevProblem ? (
          <Link to={`/problem/${prevProblem.id}`} className="btn btn-secondary btn-sm">
            <ChevronLeft size={15} />
            Previous
          </Link>
        ) : (
          <span />
        )}
        {nextProblem ? (
          <Link to={`/problem/${nextProblem.id}`} className="btn btn-secondary btn-sm">
            Next
            <ChevronRight size={15} />
          </Link>
        ) : (
          <span />
        )}
      </div>
      <div className="problem-nav-panel-toggles">
        <button
          className={`btn btn-ghost btn-sm ${marked ? 'is-active-toggle' : ''}`}
          onClick={() => setMarked((m) => !m)}
        >
          <Flag size={15} />
          {marked ? 'Marked for review' : 'Mark for review'}
        </button>
        <button
          className={`btn btn-ghost btn-sm ${saved ? 'is-active-toggle' : ''}`}
          onClick={() => setSaved((s) => !s)}
        >
          <Bookmark size={15} />
          {saved ? 'Saved' : 'Save problem'}
        </button>
      </div>
    </div>
  );
}
