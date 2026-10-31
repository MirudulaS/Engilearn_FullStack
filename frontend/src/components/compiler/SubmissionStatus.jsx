import { CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';

const verdictTone = {
  Accepted: { variant: 'success', Icon: CheckCircle2 },
  'Wrong Answer': { variant: 'danger', Icon: XCircle },
  'Compilation Error': { variant: 'danger', Icon: XCircle },
  'Runtime Error': { variant: 'danger', Icon: XCircle },
  'Time Limit Exceeded': { variant: 'warning', Icon: Clock },
};

export default function SubmissionStatus({ status, result }) {
  if (status === 'submitting') {
    return (
      <div className="submission-status">
        <Loader2 size={18} className="btn-spin" />
        <span>Submitting…</span>
      </div>
    );
  }

  if (status !== 'submitted' || !result) {
    return (
      <div className="submission-status submission-status--empty text-muted">
        Submit your solution to see the verdict here.
      </div>
    );
  }

  const tone = verdictTone[result.verdict] ?? verdictTone.Accepted;
  const { Icon } = tone;

  return (
    <div className={`submission-status submission-status--${tone.variant}`}>
      <div className="submission-status-head">
        <Icon size={20} />
        <span className="submission-status-verdict">{result.verdict}</span>
      </div>
      <div className="submission-status-grid">
        <div>
          <span className="text-muted">Tests passed</span>
          <span>{result.testsPassed} / {result.totalTests}</span>
        </div>
        <div>
          <span className="text-muted">Execution time</span>
          <span>{result.executionTimeMs} ms</span>
        </div>
        <div>
          <span className="text-muted">Memory</span>
          <span>{(result.memoryKb / 1024).toFixed(1)} MB</span>
        </div>
        <div>
          <span className="text-muted">Submitted</span>
          <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
