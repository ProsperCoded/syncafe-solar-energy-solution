
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  Sun, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, to: '/dashboard' },
  { name: 'Devices', icon: <Zap className="w-5 h-5" />, to: '/dashboard/devices' },
  { name: 'Solar Production', icon: <Sun className="w-5 h-5" />, to: '/dashboard/solar' },
  { name: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, to: '/dashboard/analytics' },
  { name: 'Notifications', icon: <Bell className="w-5 h-5" />, to: '/dashboard/notifications' },
  { name: 'Settings', icon: <Settings className="w-5 h-5" />, to: '/dashboard/settings' },
];

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Logout failed', { description: error.message });
      } else {
        toast.success('Logged out successfully');
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white w-64 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-purple-400">Syncarfe</h1>
        <p className="text-sm text-gray-400">Energy Management</p>
      </div>
      
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-purple-800 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center p-3 w-full rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};
