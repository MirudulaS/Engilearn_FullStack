import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="page-container">
      <div className="state-block">
        <Compass size={28} color="var(--color-text-faint)" />
        <h3>Page not found</h3>
        <p>The page you're looking for doesn't exist or may have moved.</p>
        <Link to="/" className="btn btn-secondary btn-sm">
          Back to home
        </Link>
      </div>
    </div>
  );
}
