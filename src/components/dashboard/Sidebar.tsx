import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Car, Users, Settings, LogOut, Wallet, Receipt, Map, UserCog, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/logo.png';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const links = [
    { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Utilisateurs', path: '/dashboard/users', icon: UserCog, roles: ['ADMIN'] }, // New Link
    { name: 'Suivi GPS', path: '/dashboard/tracking', icon: Map, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Bureaux', path: '/dashboard/offices', icon: Building2, roles: ['ADMIN'] },
    { name: 'Véhicules', path: '/dashboard/vehicles', icon: Car, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Chauffeurs', path: '/dashboard/drivers', icon: Users, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Versements', path: '/dashboard/payments', icon: Wallet, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Dépenses', path: '/dashboard/expenses', icon: Receipt, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Paramètres', path: '/dashboard/settings', icon: Settings, roles: ['ADMIN', 'MANAGER'] },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0 border-r border-gray-800 z-30">
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <img src={Logo} alt="Logo" className="w-8 h-8" />
        <span className="font-bold text-xl tracking-tight">Bajaj<span className="text-yellow-500">Sync</span></span>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {links.filter(link => link.roles.includes(user?.role || '')).map((link) => {
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

      <div className="p-4 border-t border-gray-800 space-y-3">
        <Link 
          to="/dashboard/profile"
          className="bg-gray-800 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-700 transition-colors group cursor-pointer"
        >
          <div className="bg-gray-700 p-2 rounded-lg group-hover:bg-gray-600 transition-colors">
            <UserCircle size={20} className="text-gray-300" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.firstName}</p>
            <p className="text-xs text-gray-400 truncate">Mon Profil</p>
          </div>
        </Link>

        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 py-2.5 rounded-lg transition-colors text-sm font-bold"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </div>
  );
};
