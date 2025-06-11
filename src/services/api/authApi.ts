import AtleticaHubAPI from './baseApi';
import { firebaseService } from '../firebase/firebaseService';

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

class AuthAPI extends AtleticaHubAPI {  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('🔄 Tentando login...');
      
      await firebaseService.initialize();
      const idToken = await firebaseService.signIn(email, password);
      console.log('✅ Firebase OK, enviando para backend...');
      
      // Enviar o token no header Authorization em vez do body
      const response = await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ 
          email: email,
          displayName: email.split('@')[0]
        }),
        auth: false
      });
      
      this.setToken(response.token);
      console.log('✅ Login Firebase completo!');
      return response;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      await firebaseService.initialize();
      const idToken = await firebaseService.signUp(userData.email, userData.password);
      
      const response = await this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          idToken,
          ...userData
        }),
        auth: false
      });

      this.setToken(response.token);
      return response;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await firebaseService.signOut();
      this.removeToken();
    } catch (error) {
      console.error('Erro no logout:', error);
      this.removeToken();
    }
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('athletica_token', token);
    }
  }

  initializeToken(): void {
    console.log('Token initialization delegated to Firebase');
  }
}

export const authApi = new AuthAPI();
export default authApi;