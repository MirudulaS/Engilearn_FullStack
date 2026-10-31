import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="app-main app-main--no-sidebar">
        <Navbar />
        <main id="main-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
