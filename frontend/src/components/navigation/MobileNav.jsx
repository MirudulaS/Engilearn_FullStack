import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Boxes, Code2, Dumbbell, User } from 'lucide-react';
import './MobileNav.css';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/departments', label: 'Departments', icon: Boxes },
  { to: '/practice', label: 'Practice', icon: Dumbbell },
  { to: '/compiler', label: 'Compiler', icon: Code2 },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Primary">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `mobile-nav-link ${isActive ? 'is-active' : ''}`}
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
