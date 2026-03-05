import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-yellow-600 font-bold italic">Vérification de la session...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 1. Redirection forcée basée sur le statut de licence pour les gestionnaires (role_id: 2)
    if (user?.role_id === 2) {
        if (user.status === 'pending' && location.pathname !== '/activate') {
            return <Navigate to="/activate" replace />;
        }
        if (user.status === 'waiting' && location.pathname !== '/waiting') {
            return <Navigate to="/waiting" replace />;
        }
        // Si actif mais sur une page de "pending/waiting", renvoyer au dashboard
        if (user.status === 'active' && (location.pathname === '/activate' || location.pathname === '/waiting')) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    // 2. Vérification des rôles (optionnel)
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
