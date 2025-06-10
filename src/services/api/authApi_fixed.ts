// Auth API Service - Firebase + Backend Integration

import AtleticaHubAPI from './baseApi';
import { FirebaseService } from '../firebase/firebaseService';

const firebaseService = new FirebaseService();

// Types for API requests/responses
export interface User {
  id: string;
  email: string;
  nome: string;
  role: 'user' | 'admin' | 'moderator';
  dataNascimento?: string;
  telefone?: string;
  curso?: string;
  status?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface RegisterData {
  nome: string;
  email: string;
  password: string;
  telefone: string;
  dataNascimento: string;
  curso: string;
  codigo?: string;
}

// Auth API Class extending base API
class AuthAPI extends AtleticaHubAPI {
  // Login com Firebase + Backend
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // 1. Autenticar no Firebase
      const idToken = await firebaseService.signIn(email, password);
      
      // 2. Enviar idToken para o backend
      const response = await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ idToken }),
        auth: false
      });

      // 3. Armazenar token JWT para requisições futuras
      this.setToken(response.token);

      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  // Registro de novo usuário
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // 1. Criar usuário no Firebase
      const idToken = await firebaseService.signUp(userData.email, userData.password);
      
      // 2. Registrar no backend com o token do Firebase
      const response = await this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          idToken,
          ...userData
        }),
        auth: false
      });

      // 3. Armazenar token JWT para requisições futuras
      this.setToken(response.token);

      return response;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      // 1. Logout do Firebase
      await firebaseService.signOut();
      
      // 2. Informar ao backend (opcional)
      try {
        await this.request('/auth/logout', { method: 'POST' });
      } catch (error) {
        console.warn('Erro ao fazer logout no servidor:', error);
      }
      
      // 3. Limpar token local
      this.removeToken();
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, limpa o token local
      this.removeToken();
      throw error;
    }
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    const token = typeof window !== 'undefined' ? 
      localStorage.getItem('authToken') || localStorage.getItem('athletica_token') : null;
    return !!token && !!this.token;
  }

  // Verificar se o token é válido fazendo uma requisição ao backend
  async verifyToken(): Promise<boolean> {
    try {
      if (!this.isAuthenticated()) {
        return false;
      }
      
      await this.getProfile();
      return true;
    } catch (error) {
      console.warn('Token inválido detectado, limpando...', error);
      this.removeToken();
      return false;
    }
  }

  // Obter perfil do usuário
  async getProfile(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Atualizar perfil
  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  // Set token method (inherited from base class but add interface)
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('athletica_token', token);
    }
  }

  // Inicializar token a partir do localStorage
  initializeToken(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken') || localStorage.getItem('athletica_token');
      if (token) {
        this.token = token;
      }
    }
  }
}

// Criar instância e inicializar token
const authApi = new AuthAPI();
authApi.initializeToken();

export { authApi };
export default authApi;
