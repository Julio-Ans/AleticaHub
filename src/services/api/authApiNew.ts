// Auth API Service - Comunicação com Firebase e Backend para autenticação

import AtleticaHubAPI from './baseApi';

// Types for API requests/responses
export interface BackendLoginRequest {
  idToken: string;
  email: string;
  displayName?: string;
}

export interface BackendLoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string; // Firebase UID
    email: string;
    nome: string;
    role: 'user' | 'admin';
    dataNascimento?: string;
    telefone?: string;
    curso?: string;
    createdAt: string;
  };
}

export interface VerifyTokenResponse {
  valid: boolean;
  user: {
    uid: string;
    email: string;
    role: 'user' | 'admin';
  };
}

class AuthService extends AtleticaHubAPI {
  // Login/Registro no backend com token do Firebase
  async loginWithFirebase(data: BackendLoginRequest): Promise<BackendLoginResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: false
    });
  }

  // Verificar se token JWT é válido
  async verifyToken(): Promise<VerifyTokenResponse> {
    return this.request('/auth/verify');
  }

  // Verificar se usuário é válido
  async verifyUser(): Promise<{ valid: boolean }> {
    return this.request('/auth/verify-user');
  }

  // Verificar se usuário é admin
  async verifyAdmin(): Promise<{ valid: boolean }> {
    return this.request('/auth/verify-admin');
  }
}

export const authService = new AuthService();
