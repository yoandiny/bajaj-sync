import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Smartphone, ShieldCheck, LogOut, Settings, MessageSquare, Menu, X, Building2 } from 'lucide-react';
import Logo from '../assets/logo.png';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

export const PlatformLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'SUPER_ADMIN') return <Navigate to="/dashboard" replace />;

  const links = [
    { name: 'Vue d\'ensemble', path: '/platform', icon: LayoutDashboard },
    { name: 'Utilisateurs', path: '/platform/users', icon: Users },
    { name: 'Entreprises', path: '/platform/companies', icon: Building2 },
    { name: 'Licences', path: '/platform/licenses', icon: ShieldCheck },
    { name: 'Appareils', path: '/platform/devices', icon: Smartphone },
    { name: 'Feedbacks', path: '/platform/feedbacks', icon: MessageSquare },
    { name: 'Paramètres', path: '/platform/settings', icon: Settings },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  const SidebarContent = () => (
    <div className="h-full bg-gray-900 text-white flex flex-col border-r border-gray-800">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Logo" className="w-8 h-8" />
          <div>
            <span className="font-bold text-lg tracking-tight block">BajajSync</span>
            <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Platform Admin</span>
          </div>
        </div>
        {/* Close button on mobile */}
        <button
          onClick={closeMenu}
          className="md:hidden p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMenu}
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
        <div className="bg-gray-800/50 rounded-xl p-4 mb-3 border border-gray-700">
          <p className="text-sm font-bold text-white">Super Admin</p>
          <p className="text-xs text-gray-400 mt-0.5">Gérant de la Plateforme</p>
        </div>
        <button
          onClick={() => { logout(); closeMenu(); }}
          className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 py-2.5 rounded-lg transition-colors text-sm font-bold"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed w-64 h-full z-30">
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-7 h-7" />
          <div>
            <span className="font-bold text-base block leading-tight">BajajSync</span>
            <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest">Platform Admin</span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-xl hover:bg-gray-800 transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" onClick={closeMenu}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-72 max-w-[85vw] h-full animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="md:ml-64">
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
