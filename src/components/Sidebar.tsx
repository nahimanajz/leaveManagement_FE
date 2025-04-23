
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  ClipboardList, 
  BarChart3, 
  Users, 
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: Home },
    { name: 'Leave Types', path: '/admin/leave-types', icon: ClipboardList },
    { name: 'Leave Calendar', path: '/admin/calendar', icon: Calendar },
    { name: 'Manage Leaves', path: '/admin/manage-leaves', icon: ClipboardList },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Employees', path: '/admin/employees', icon: Users }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary">Africa HR</h1>
      </div>
      <nav className="mt-6 px-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 pl-3">
          Admin Controls
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = 
              (item.path === '/admin' && location.pathname === '/admin') ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
              
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-secondary/10 text-primary" 
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 mr-2", isActive ? "text-primary" : "text-gray-500")} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
