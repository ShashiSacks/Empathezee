import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Activity, MessageSquare, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../features/auth/AuthContext';
import { useTheme } from '../ThemeProvider';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Activity, label: 'My Health', path: '/health' },
  { icon: Calendar, label: 'Appointments', path: '/appointments' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="w-64 border-r bg-card h-screen sticky top-0 flex flex-col pt-8 pb-6 px-4">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-display font-bold">
          E
        </div>
        <span className="font-display font-bold text-xl tracking-tight">Empathezee</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors duration-200",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-secondary-foreground hover:bg-secondary"
              )
            }
          >
            <item.icon className="w-5 h-5" strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border mt-auto space-y-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm font-medium text-secondary-foreground/70 hover:bg-secondary hover:text-secondary-foreground transition-all duration-200 group"
        >
          {theme === 'dark' ? (
            <><Sun className="w-5 h-5 text-secondary-foreground/50 group-hover:text-primary transition-colors" /> Light Mode</>
          ) : (
            <><Moon className="w-5 h-5 text-secondary-foreground/50 group-hover:text-primary transition-colors" /> Dark Mode</>
          )}
        </button>

        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm font-medium text-secondary-foreground/70 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 text-secondary-foreground/50 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
