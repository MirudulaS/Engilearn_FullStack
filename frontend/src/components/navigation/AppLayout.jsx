import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar showSidebarToggle onToggleSidebar={() => setCollapsed((c) => !c)} />
      <Sidebar collapsed={collapsed} />
      <div
        className="app-main app-main--with-mobile-nav"
        style={{ marginLeft: collapsed ? 'var(--sidebar-width-collapsed)' : undefined }}
      >
        <main id="main-content">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
