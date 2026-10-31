import { CheckCircle2, Circle } from 'lucide-react';
import { EmptyState } from '../common/States';

export default function TestCasePanel({ testCases = [], status }) {
  if (testCases.length === 0) {
    return <EmptyState title="No test cases" description="This problem doesn't have example test cases attached yet." />;
  }

  return (
    <div className="testcase-panel">
      {testCases.map((tc, i) => {
        const Icon = status === 'submitted' ? CheckCircle2 : Circle;
        const color = status === 'submitted' ? 'var(--color-success)' : 'var(--color-text-faint)';
        return (
          <div className="testcase-row" key={i}>
            <Icon size={16} color={color} />
            <div className="testcase-row-body">
              <span className="text-muted">Test case {i + 1}</span>
              <div className="testcase-row-io">
                <code>{tc.input}</code>
                <span className="text-faint">→</span>
                <code>{tc.output}</code>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
