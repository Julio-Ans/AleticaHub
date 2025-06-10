// filepath: c:\Users\julio\Downloads\AtleticaHub-FrontEnd\AleticaHub\src\context\AuthContext.tsx
// Auth Context - Gerenciamento global do estado de autenticação

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, AuthResponse, User, RegisterData } from '../services/api/authApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  checkRole: (role: 'user' | 'admin' | 'moderator') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);  // Check if user is authenticated on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🚀 Verificando autenticação inicial...');
        
        // Primeiro, tentar carregar usuário pelo token salvo
        try {
          authApi.initializeToken();
          const storedToken = typeof window !== 'undefined' ? 
            localStorage.getItem('authToken') || localStorage.getItem('athletica_token') : null;
          
          if (storedToken) {
            console.log('🔑 Token encontrado no localStorage, verificando validade...');
            authApi.setToken(storedToken);
            
            // Tentar obter perfil do usuário para confirmar token válido
            const userProfile = await authApi.getProfile();
            console.log('✅ Usuário autenticado encontrado:', userProfile.nome);
            setUser(userProfile);
          } else {
            console.log('ℹ️ Nenhum token encontrado no localStorage');
            setUser(null);
          }
        } catch (tokenError) {
          console.log('⚠️ Token inválido ou expirado, limpando...', tokenError);
          // Limpar tokens inválidos
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('athletica_token');
          }
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Erro na verificação inicial:', error);
        setUser(null);
      } finally {
        console.log('🏁 Verificação inicial concluída');
        setIsLoading(false);
      }
    };

    // Adicionar delay para evitar problemas de hidratação
    const timer = setTimeout(initAuth, 100);
    return () => clearTimeout(timer);
  }, []);
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      console.log('🔄 Iniciando login...');

      const response = await authApi.login(email, password);
      console.log('✅ Login bem-sucedido:', response.user.nome);
      
      // Garantir que o token foi salvo
      if (response.token) {
        authApi.setToken(response.token);
        console.log('🔑 Token salvo no localStorage');
      }
      
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await authApi.register(userData);
      setUser(response.user);

      return response;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Even if API call fails, clear local state
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await authApi.updateProfile(userData);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const checkRole = (requiredRole: 'user' | 'admin' | 'moderator'): boolean => {
    if (!user) return false;

    if (requiredRole === 'user') {
      return ['user', 'admin', 'moderator'].includes(user.role);
    }

    if (requiredRole === 'moderator') {
      return ['moderator', 'admin'].includes(user.role);
    }

    if (requiredRole === 'admin') {
      return user.role === 'admin';
    }

    return false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    checkRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
