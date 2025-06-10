// filepath: c:\Users\julio\Downloads\AtleticaHub-FrontEnd\AleticaHub\src\components\ProtectedRoute.tsx
// Protected Route Component - Proteção de rotas baseada em autenticação e roles

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
  redirectTo?: string;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'user',
  redirectTo = '/login',
  fallback = <div className="flex items-center justify-center min-h-screen bg-black text-white">Carregando...</div>
}) => {
  const { isAuthenticated, checkRole, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole && !checkRole(requiredRole)) {
        // Redirect based on user role
        if (user?.role === 'admin') {
          router.push('/admin-dashboard');
        } else {
          router.push('/home');
        }
        return;
      }
    }
  }, [isAuthenticated, isLoading, checkRole, requiredRole, router, redirectTo, user]);

  if (isLoading) {
    return fallback;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (requiredRole && !checkRole(requiredRole)) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
