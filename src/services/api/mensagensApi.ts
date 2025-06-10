// Mensagens API Service - Chat por esporte

import AtleticaHubAPI from './baseApi';

export interface Mensagem {
  id: string;
  remetenteId: string;
  esporteId: string; // "0" para chat geral
  texto: string; // Corrigido para 'texto'
  criadaEm: string;
  remetente: {
    nome: string;
    email: string;
  };
}

export interface CreateMensagemData {
  esporteId: string;
  texto: string; // Corrigido para 'texto'
}

class MensagensService extends AtleticaHubAPI {  // Buscar mensagens de um esporte
  async buscarMensagens(esporteId: string): Promise<Mensagem[]> {
    console.log(`🌐 API: Buscando mensagens para esporte ${esporteId}`);
    try {
      const result = await this.request(`/api/mensagens/${esporteId}`);
      console.log(`✅ API: Sucesso ao buscar mensagens do esporte ${esporteId}:`, result.length, 'mensagens');
      return result;
    } catch (error) {
      console.error(`❌ API: Erro ao buscar mensagens do esporte ${esporteId}:`, error);
      throw error;
    }
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