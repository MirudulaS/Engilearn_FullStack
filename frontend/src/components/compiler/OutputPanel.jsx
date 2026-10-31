import { Loader2 } from 'lucide-react';
import Badge from '../common/Badge';

export default function OutputPanel({ status, result }) {
  return (
    <div className="output-panel">
      <div className="output-panel-status">
        {status === 'running' && (
          <span className="badge badge-info">
            <Loader2 size={12} className="btn-spin" /> Running…
          </span>
        )}
        {status === 'ran' && result?.status === 'success' && (
          <Badge variant="success">Executed successfully</Badge>
        )}
        {status === 'ran' && result?.status === 'error' && <Badge variant="danger">Error</Badge>}
        {status === 'idle' && <Badge variant="neutral">Idle</Badge>}
        {result?.executionTimeMs != null && status === 'ran' && (
          <span className="text-faint output-panel-time">{result.executionTimeMs} ms</span>
        )}
      </div>
      <pre className="output-panel-console">
        {result?.stderr ? result.stderr : result?.stdout || 'Run your code to see output here.'}
      </pre>
    </div>
  );
}
