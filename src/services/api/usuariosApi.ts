// Usuários API Service - Serviço para gerenciar usuários

import AtleticaHubAPI from './baseApi';

export interface Usuario {
  id: number;
  uid: string; // Firebase UID
  nome: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
  curso?: string;
  role: 'user' | 'admin';
  status: 'ativo' | 'pendente' | 'suspenso';
  criadoEm: string;
  atualizadoEm: string;
}

export interface UpdateUsuarioData {
  nome?: string;
  telefone?: string;
  curso?: string;
  role?: 'user' | 'admin';
  status?: 'ativo' | 'pendente' | 'suspenso';
}

class UsuariosService extends AtleticaHubAPI {
  // Listar todos os usuários (admin apenas)
  async listarUsuarios(): Promise<Usuario[]> {
    return this.request('/api/users');
  }

  // Buscar usuário por ID
  async buscarUsuario(id: number): Promise<Usuario> {
    return this.request(`/api/users/${id}`);
  }

  // Atualizar usuário (admin apenas)
  async atualizarUsuario(id: number, data: UpdateUsuarioData): Promise<{ success: boolean; message: string; usuario: Usuario }> {
    return this.request(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Excluir usuário (admin apenas)
  async excluirUsuario(id: number): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/users/${id}`, {
      method: 'DELETE'
    });
  }

  // Aprovar usuário pendente (admin apenas)
  async aprovarUsuario(id: number): Promise<{ success: boolean; message: string; usuario: Usuario }> {
    return this.atualizarUsuario(id, { status: 'ativo' });
  }

  // Suspender usuário (admin apenas)
  async suspenderUsuario(id: number): Promise<{ success: boolean; message: string; usuario: Usuario }> {
    return this.atualizarUsuario(id, { status: 'suspenso' });
  }

  // Promover a admin (admin apenas)
  async promoverAdmin(id: number): Promise<{ success: boolean; message: string; usuario: Usuario }> {
    return this.atualizarUsuario(id, { role: 'admin' });
  }

  // Rebaixar de admin (admin apenas)
  async rebaixarAdmin(id: number): Promise<{ success: boolean; message: string; usuario: Usuario }> {
    return this.atualizarUsuario(id, { role: 'user' });
  }

  // Listar usuários com inscrições pendentes (admin apenas)
  async usuariosComInscricoesPendentes(): Promise<Usuario[]> {
    return this.request('/api/users?inscricoes=pendentes');
  }
}

export const usuariosService = new UsuariosService();
export default usuariosService;
