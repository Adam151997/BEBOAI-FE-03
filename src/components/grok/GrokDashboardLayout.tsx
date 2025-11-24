/**
 * GROK DASHBOARD LAYOUT
 * Pixel-perfect replication of Grok's dashboard layout
 * Features: Sidebar navigation, header, main content area, responsive design
 */

import { useState } from 'react';
import type { FC, ReactNode, ElementType } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  TrendingUp,
  CheckSquare,
  Calendar,
  Ticket,
  Briefcase,
  FileText,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Settings,
  Search,
  Bell,
} from 'lucide-react';

interface MenuItem {
  name: string;
  path: string;
  icon: ElementType;
  badge?: number;
}

interface GrokDashboardLayoutProps {
  children: ReactNode;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
}

export const GrokDashboardLayout: FC<GrokDashboardLayoutProps> = ({
  children,
  user,
  currentPath = '/dashboard',
  onNavigate,
  onLogout,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users, badge: 12 },
    { name: 'Accounts', path: '/accounts', icon: Building2 },
    { name: 'Contacts', path: '/contacts', icon: UserCheck },
    { name: 'Opportunities', path: '/opportunities', icon: TrendingUp, badge: 5 },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare, badge: 8 },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Cases', path: '/cases', icon: Ticket },
    { name: 'Teams', path: '/teams', icon: Briefcase },
    { name: 'Documents', path: '/documents', icon: FileText },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.toggle('light');
  };

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : 'light'}`}>
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-grok-bg-secondary border-b border-grok-border-subtle backdrop-blur-sm">
        <div className="flex items-center justify-between h-16 px-grok-lg">
          {/* Left Section - Menu Toggle & Logo */}
          <div className="flex items-center gap-grok-lg">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="grok-btn grok-btn-ghost grok-btn-icon"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-grok-xl font-grok-bold text-grok-text-primary">
              Grok CRM
            </h1>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-2xl mx-grok-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-grok-text-tertiary" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 bg-grok-bg-primary border border-grok-border-subtle rounded-grok-md text-grok-sm text-grok-text-primary placeholder-grok-text-tertiary focus:border-grok-blue focus:outline-none focus:ring-2 focus:ring-grok-blue focus:ring-opacity-20 transition-all"
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-grok-md">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="grok-btn grok-btn-ghost grok-btn-icon"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <button className="grok-btn grok-btn-ghost grok-btn-icon relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-grok-red rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-grok-md hover:opacity-80 transition-opacity"
              >
                <div className="grok-avatar grok-avatar-sm">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} />
                  ) : (
                    <span>{user?.name.charAt(0) || 'U'}</span>
                  )}
                </div>
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-grok-md border border-grok-border-subtle bg-grok-bg-secondary shadow-grok-xl z-50">
                    {/* User Info */}
                    <div className="p-grok-lg border-b border-grok-border-subtle">
                      <p className="font-grok-semibold text-grok-sm text-grok-text-primary">
                        {user?.name || 'User Name'}
                      </p>
                      <p className="text-grok-xs text-grok-text-secondary mt-1">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <button className="w-full flex items-center gap-grok-md px-grok-md py-grok-md text-grok-sm rounded-grok-md text-grok-text-primary hover:bg-grok-bg-tertiary transition-colors">
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout?.();
                        }}
                        className="w-full flex items-center gap-grok-md px-grok-md py-grok-md text-grok-sm rounded-grok-md text-grok-red hover:bg-grok-bg-tertiary transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-grok-bg-secondary border-r border-grok-border-subtle transition-all duration-300 overflow-hidden sticky top-16 h-[calc(100vh-4rem)]`}
        >
          <nav className="p-grok-lg space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`grok-nav-item w-full ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <span className="grok-badge grok-badge-primary text-grok-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-grok-xl bg-grok-bg-primary min-h-[calc(100vh-4rem)]">
          <div className="max-w-grok-container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GrokDashboardLayout;
