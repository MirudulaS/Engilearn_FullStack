import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, CircuitBoard, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar({ onToggleSidebar, showSidebarToggle = false }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        {showSidebarToggle && (
          <button
            className="navbar-icon-btn"
            aria-label="Toggle sidebar"
            onClick={onToggleSidebar}
          >
            <Menu size={20} />
          </button>
        )}
        <Link to="/" className="navbar-brand">
          <CircuitBoard size={20} color="var(--color-accent)" />
          <span>EngiLearn</span>
        </Link>
      </div>

      <div className="navbar-search">
        <Search size={16} color="var(--color-text-faint)" />
        <input
          type="search"
          placeholder="Search courses, problems, topics…"
          aria-label="Search"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              navigate(`/search?q=${encodeURIComponent(e.currentTarget.value.trim())}`);
            }
          }}
        />
      </div>

      <nav className="navbar-right">
        <button className="navbar-icon-btn" aria-label="Notifications">
          <Bell size={19} />
          <span className="navbar-notif-dot" />
        </button>
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="navbar-user-name">
              {user?.name}
            </Link>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              <LogOut size={14} />
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-sm">
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
