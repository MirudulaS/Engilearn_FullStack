import { Inbox, AlertTriangle } from 'lucide-react';
import Button from './Button';

export function LoadingState({ message = 'Loading…' }) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', description, action, onAction }) {
  return (
    <div className="state-block">
      <Inbox size={28} color="var(--color-text-faint)" />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'That request failed. Try again.',
  action = 'Retry',
  onAction,
}) {
  return (
    <div className="state-block">
      <AlertTriangle size={28} color="var(--color-danger)" />
      <h3>{title}</h3>
      <p>{description}</p>
      {onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  );
}

export function SkeletonBlock({ height = 16, width = '100%', style = {} }) {
  return <div className="skeleton" style={{ height, width, ...style }} />;
}
