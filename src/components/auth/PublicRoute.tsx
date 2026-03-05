import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface PublicRouteProps {
    children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-yellow-600 font-bold italic">Vérification...</div>;
    }

    if (isAuthenticated && user) {
        // Si déjà connecté, rediriger selon le statut
        if (user.role_id === 2) {
            if (user.status === 'pending') return <Navigate to="/activate" replace />;
            if (user.status === 'waiting') return <Navigate to="/waiting" replace />;
            return <Navigate to="/dashboard" replace />;
        }
        if (user.role === 'SUPER_ADMIN') {
            return <Navigate to="/platform" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
