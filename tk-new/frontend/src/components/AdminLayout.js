import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Image, Images, Briefcase, Users, Mail, FileText, LogOut } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/portfolio', label: 'Portfolio', icon: Image },
    { path: '/admin/gallery', label: 'Gallery', icon: Images },
    { path: '/admin/services', label: 'Services', icon: Briefcase },
    { path: '/admin/team', label: 'Team', icon: Users },
    { path: '/admin/inquiries', label: 'Inquiries', icon: Mail },
    { path: '/admin/blog', label: 'Blog', icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-background" data-testid="admin-layout">
      <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-card" data-testid="admin-sidebar">
        <div className="p-6">
          <h2 className="text-2xl font-heading text-white mb-2" data-testid="admin-logo">THE DARKROOM</h2>
          <p className="text-xs text-white/40" data-testid="admin-panel-label">Admin Panel</p>
        </div>

        <nav className="px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={`flex items-center gap-3 px-4 py-3 mb-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-white/10">
          <div className="mb-4 px-4">
            <p className="text-white text-sm" data-testid="admin-user-name">{user?.name}</p>
            <p className="text-white/40 text-xs" data-testid="admin-user-email">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            data-testid="logout-button"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8" data-testid="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
