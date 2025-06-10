// Auth Guard Hook - Proteção de rotas que precisam de autenticação
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requiredRole?: 'user' | 'admin';
  requireEmailVerified?: boolean;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { 
    redirectTo = '/login', 
    requiredRole,
    requireEmailVerified = false 
  } = options;
  
  const { user, isAuthenticated, isLoading, checkRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) return;

    // Redirect if not authenticated
    if (!isAuthenticated || !user) {
      router.push(redirectTo);
      return;
    }

    // Check role requirements
    if (requiredRole && !checkRole(requiredRole)) {
      router.push('/unauthorized');
      return;
    }    // Check email verification requirements
    if (requireEmailVerified && user.role !== 'admin') {
      router.push('/verify-email');
      return;
    }
  }, [isAuthenticated, isLoading, user, requiredRole, requireEmailVerified, router, redirectTo, checkRole]);

  return {
    user,
    isAuthenticated,
    isLoading,
    checkRole
  };
};

// HOC for protecting pages
export const withAuthGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: UseAuthGuardOptions = {}
) => {
  return function AuthGuardedComponent(props: P) {
    const authData = useAuthGuard(options);
    
    // Show loading state - return null and let useAuthGuard handle redirect
    if (authData.isLoading) {
      return null;
    }

    // Don't render if not authenticated (useAuthGuard will handle redirect)
    if (!authData.isAuthenticated) {
      return null;
    }

    return React.createElement(WrappedComponent, props);
  };
};
