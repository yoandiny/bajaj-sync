import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Car, Users, Settings, LogOut, Wallet, Receipt, Map, MessageSquare, X, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/logo.png';
import { cn } from '../../lib/utils';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const links = [
    { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard, roles: ['OWNER', 'MANAGER'] },
    { name: 'Suivi GPS', path: '/dashboard/tracking', icon: Map, roles: ['OWNER', 'MANAGER'] },
    { name: 'Dettes', path: '/dashboard/debts', icon: BarChart3, roles: ['OWNER', 'MANAGER'] },
    { name: 'Gérants', path: '/dashboard/managers', icon: Users, roles: ['OWNER'] },
    { name: 'Bureaux', path: '/dashboard/offices', icon: Building2, roles: ['OWNER'] },
    { name: 'Véhicules', path: '/dashboard/vehicles', icon: Car, roles: ['OWNER', 'MANAGER'] },
    { name: 'Chauffeurs', path: '/dashboard/drivers', icon: Users, roles: ['OWNER', 'MANAGER'] },
    { name: 'Versements', path: '/dashboard/payments', icon: Wallet, roles: ['OWNER', 'MANAGER'] },
    { name: 'Dépenses', path: '/dashboard/expenses', icon: Receipt, roles: ['OWNER', 'MANAGER'] },
    { name: 'Paramètres', path: '/dashboard/settings', icon: Settings, roles: ['OWNER', 'MANAGER'] },
    { name: 'Donner un avis', path: '/dashboard/feedback', icon: MessageSquare, roles: ['OWNER', 'MANAGER'] },
  ];

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0 border-r border-gray-800 z-30">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-gray-800">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={handleLinkClick}>
          <img src={Logo} alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tight text-white">
            Bajaj<span className="text-yellow-500">Sync</span>
          </span>
        </Link>
        {/* Close button — only visible on mobile (when onClose is provided) */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {links
          .filter(link => link.roles.includes(user?.role?.toUpperCase() || ''))
          .map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
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

      {/* User / Logout */}
      <div className="p-4 border-t border-gray-800">
        <Link
          to="/dashboard/profile"
          onClick={handleLinkClick}
          className="block bg-gray-800 rounded-xl p-4 mb-3 hover:bg-gray-750 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-gray-900 font-bold text-lg shrink-0">
              {user?.firstName?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate group-hover:text-yellow-500 transition-colors">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 capitalize truncate">
                {user?.role?.toUpperCase() === 'OWNER'
                  ? 'Administrateur'
                  : user?.role?.toUpperCase() === 'SUPER_ADMIN'
                    ? 'Super Admin'
                    : 'Gérant Bureau'}
              </p>
              {user?.role?.toUpperCase() === 'MANAGER' && user?.officeName && (
                <div className="mt-2 py-1 px-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-[10px] font-black text-yellow-500 uppercase tracking-tighter truncate">
                    📍 {user.officeName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Link>
        <button
          onClick={() => { logout(); if (onClose) onClose(); }}
          className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 py-2.5 rounded-lg transition-colors text-sm font-bold"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </div>
  );
};
