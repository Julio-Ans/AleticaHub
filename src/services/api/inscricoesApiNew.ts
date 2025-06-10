// Inscrições API Service - Sistema de inscrições em esportes

import AtleticaHubAPI from './baseApi';

export interface Inscricao {
  id: string;
  usuarioId: string;
  esporteId: string;
  status: 'pendente' | 'aceito' | 'rejeitado';
  criadaEm: string;
  esporte?: {
    id: string;
    nome: string;
    fotoUrl?: string;
  };
  usuario?: {
    nome: string;
    email: string;
  };
}

export interface CreateInscricaoResponse {
  inscricao: Inscricao;
  message: string;
}

export interface UpdateStatusResponse {
  message: string;
  inscricao: Inscricao;
}

class InscricoesService extends AtleticaHubAPI {
  // Inscrever-se em esporte
  async inscreverEsporte(esporteId: string): Promise<CreateInscricaoResponse> {
    return this.request(`/api/inscricoes/${esporteId}`, {
      method: 'POST'
    });
  }

  // Listar minhas inscrições
  async minhasInscricoes(): Promise<Inscricao[]> {
    return this.request('/api/inscricoes/minhas');
  }

  // Listar todas as inscrições (admin)
  async listarInscricoes(params?: {
    status?: 'pendente' | 'aceito' | 'rejeitado';
    esporteId?: string;
  }): Promise<Inscricao[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.esporteId) {
      queryParams.append('esporteId', params.esporteId);
    }

    const query = queryParams.toString();
    const endpoint = query ? `/api/inscricoes?${query}` : '/api/inscricoes';
    
    return this.request(endpoint);
  }

  // Gerenciar status da inscrição (admin)
  async atualizarStatus(inscricaoId: string, status: 'aceito' | 'rejeitado'): Promise<UpdateStatusResponse> {
    return this.request(`/api/inscricoes/${inscricaoId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }
}

export const inscricoesService = new InscricoesService();
export default inscricoesService;
