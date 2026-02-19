import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Smartphone, ShieldCheck, LogOut, MessageSquare } from 'lucide-react';
import Logo from '../assets/logo.png';
import { cn } from '../lib/utils';

export const PlatformLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'SUPER_ADMIN') return <Navigate to="/dashboard" replace />;

  const links = [
    { name: 'Vue d\'ensemble', path: '/platform', icon: LayoutDashboard },
    { name: 'Utilisateurs', path: '/platform/users', icon: Users },
    { name: 'Licences', path: '/platform/licenses', icon: ShieldCheck },
    { name: 'Appareils', path: '/platform/devices', icon: Smartphone },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white fixed h-full flex flex-col border-r border-gray-800 z-30">
        <div className="p-6 flex items-center gap-3 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <img src={Logo} alt="Logo" className="w-8 h-8" />
          <div>
            <span className="font-bold text-lg tracking-tight block">BajajSync</span>
            <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Platform Admin</span>
          </div>
        </div>

        <div className="flex-1 py-6 px-3 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                  isActive 
                    ? "bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/20" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                <link.icon size={20} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-800">
            <div className="bg-gray-800/50 rounded-xl p-4 mb-3 border border-gray-700">
                <p className="text-sm font-bold text-white">Super Admin</p>
                <p className="text-xs text-gray-400 mt-0.5">Gérant de la Plateforme</p>
            </div>
            <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 py-2.5 rounded-lg transition-colors text-sm font-bold"
            >
                <LogOut size={18} />
                Déconnexion
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <main className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
