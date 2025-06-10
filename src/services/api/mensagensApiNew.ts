// Mensagens API Service - Sistema de chat por esporte

import AtleticaHubAPI from './baseApi';

export interface Mensagem {
  _id: string; // MongoDB ObjectId
  texto: string;
  usuarioId: string;
  nomeUsuario: string;
  esporteId: string; // "0" para chat geral
  criadaEm: string;
}

export interface CreateMensagemData {
  texto: string;
  esporteId: string;
}

class MensagensService extends AtleticaHubAPI {
  // Listar mensagens por esporte
  async listarMensagens(
    esporteId: string, 
    params?: { limit?: number; offset?: number }
  ): Promise<Mensagem[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.offset) {
      queryParams.append('offset', params.offset.toString());
    }

    const query = queryParams.toString();
    const endpoint = query 
      ? `/api/mensagens/${esporteId}?${query}` 
      : `/api/mensagens/${esporteId}`;
    
    return this.request(endpoint);
  }

  // Enviar mensagem
  async enviarMensagem(data: CreateMensagemData): Promise<Mensagem> {
    return this.request('/api/mensagens', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Excluir mensagem
  async excluirMensagem(id: string): Promise<{ message: string }> {
    return this.request(`/api/mensagens/${id}`, {
      method: 'DELETE'
    });
  }
}

export const mensagensService = new MensagensService();
export default mensagensService;
