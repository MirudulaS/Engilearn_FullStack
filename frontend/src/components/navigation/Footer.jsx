import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">EngiLearn</div>
        <nav className="site-footer-links">
          <Link to="/about">About</Link>
          <Link to="/departments">Departments</Link>
          <Link to="/features">Features</Link>
          <Link to="/learning-paths">Learning Paths</Link>
        </nav>
        <p className="site-footer-copy">© {new Date().getFullYear()} EngiLearn. Built for learning, not yet in production.</p>
      </div>
    </footer>
  );
}
