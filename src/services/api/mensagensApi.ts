// Mensagens API Service - Chat por esporte

import AtleticaHubAPI from './baseApi';

export interface Mensagem {
  id: string;
  remetenteId: string;
  esporteId: string; // "0" para chat geral
  texto: string;
  criadaEm: string;
  editada?: boolean;
  fixada?: boolean;
  remetente: {
    nome: string;
    email: string;
  };
}

export interface CreateMensagemData {
  esporteId: string;
  texto: string;
}

class MensagensService extends AtleticaHubAPI {
  // Buscar mensagens de um esporte
  async buscarMensagens(esporteId: string): Promise<Mensagem[]> {
    console.log(`🌐 API: Buscando mensagens para esporte ${esporteId}`);
    try {
      const result = await this.request(`/api/mensagens/${esporteId}`) as Mensagem[];
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
  }  // Excluir mensagem (admin ou próprio usuário)
  async excluirMensagem(id: string): Promise<{ message: string }> {
    try {
      return await this.request(`/api/mensagens/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      // Se o endpoint não existe (404/405), mostrar mensagem apropriada
      if (error instanceof Error && (error.message.includes('404') || error.message.includes('405'))) {
        throw new Error('Funcionalidade de excluir mensagens ainda não implementada no servidor');
      }
      throw error;
    }
  }
  // Fixar/desfixar mensagem (apenas admin)
  async fixarMensagem(id: string, fixada: boolean): Promise<Mensagem> {
    try {
      return await this.request(`/api/mensagens/${id}/fixar`, {
        method: 'POST',
        body: JSON.stringify({ fixada })
      });
    } catch (error) {
      // Se o endpoint não existe (404/405), mostrar mensagem apropriada
      if (error instanceof Error && (error.message.includes('404') || error.message.includes('405'))) {
        throw new Error('Funcionalidade de fixar mensagens ainda não implementada no servidor');
      }
      throw error;
    }
  }

  // Editar mensagem (próprio usuário ou admin)
  async editarMensagem(id: string, texto: string): Promise<Mensagem> {
    try {
      return await this.request(`/api/mensagens/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ texto })
      });
    } catch (error) {
      // Se o endpoint não existe (404/405), mostrar mensagem apropriada
      if (error instanceof Error && (error.message.includes('404') || error.message.includes('405'))) {
        throw new Error('Funcionalidade de editar mensagens ainda não implementada no servidor');
      }
      throw error;
    }
  }
}

export const mensagensService = new MensagensService();
export default mensagensService;