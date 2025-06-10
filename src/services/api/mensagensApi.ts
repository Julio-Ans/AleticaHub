// Mensagens API Service - Chat por esporte

import AtleticaHubAPI from './baseApi';

export interface Mensagem {
  id: string;
  remetenteId: string;
  esporteId: string; // "0" para chat geral
  conteudo: string;
  criadaEm: string;
  remetente: {
    nome: string;
    email: string;
  };
}

export interface CreateMensagemData {
  esporteId: string;
  conteudo: string;
}

class MensagensService extends AtleticaHubAPI {
  // Buscar mensagens de um esporte
  async buscarMensagens(esporteId: string): Promise<Mensagem[]> {
    return this.request(`/api/mensagens/${esporteId}`);
  }

  // Enviar mensagem
  async enviarMensagem(data: CreateMensagemData): Promise<Mensagem> {
    return this.request('/api/mensagens', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Excluir mensagem (admin ou próprio usuário)
  async excluirMensagem(id: string): Promise<{ message: string }> {
    return this.request(`/api/mensagens/${id}`, {
      method: 'DELETE'
    });
  }
}

export const mensagensService = new MensagensService();
export default mensagensService;